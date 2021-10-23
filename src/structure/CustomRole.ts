import { Guild, MessageEmbed, Role, Message } from "discord.js";
import Ping from "../commands/Ping";
import { RoleDocument, Role as RoleModel } from "../database/Role";
import { BROWN } from "./utils";
import { DateTime } from "luxon";

export class CustomRole {
  roleDB: RoleDocument;
  role: Role;
  guild: Guild;

  constructor(guild: Guild, roleDB: RoleDocument) {
    this.roleDB = roleDB;
    this.guild = guild;

    const role = guild.roles.cache.find(role => role.id === roleDB.roleID);

    if (!role) {
      throw new Error(`cannot find role "${this.roleDB.roleID}"`);
    }

    this.role = role;
  }

  show() {

    const embed = new MessageEmbed()
      .setColor(BROWN)
      .setTitle("Custom Role")
      .setDescription(`${this.role}`)
      .addField("Price", this.roleDB.price.toString(), true)
      .addField("Expires", this.roleDB.duration.toString(), true)

    return embed;
  }

  async buy(msg: Message) {

    const userID = msg.author.id;
    const ping = new Ping();
    const user = await ping.getUser(userID);

    if (user.balance < this.roleDB.price) {
      return msg.channel.send("insufficient balance");
    }

    const member = this.guild.members.cache.find(member => member.id === userID);

    if (!member)
      return msg.channel.send("member not found");

    await member.roles.add(this.role);

    user.balance -= this.roleDB.price;
    user.roles.push({ roleID: this.role.id, since: new Date() });
    await user.save();

    msg.channel.send("purchase successful");
  }

  static async checkRoles(guild: Guild) {

    const roles = await RoleModel.find();

    for (const role of roles) {

      try {
        const customRole = new CustomRole(guild, role);
        for (const [, member] of customRole.role.members) {

          const ping = new Ping();
          const user = await ping.getUser(member.id);

          if (!user) continue;

          const ownedRole = user.roles.find(x => x.roleID === role.roleID);

          if (!ownedRole) continue;

          const expiry = DateTime.fromJSDate(ownedRole.since).plus({ days: 30 });
          const now = DateTime.now();

          if (expiry <= now) {

            user.roles = user.roles.filter(x => x.roleID === role.roleID);
            member.roles.remove(role.roleID);

            await user.save();
          }
        }
      } catch {
        continue;
      }

    }
  }
}
