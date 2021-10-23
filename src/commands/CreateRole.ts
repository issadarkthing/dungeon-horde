import { ColorResolvable, Message } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
import { Role } from "../database/Role";

export default class extends UserCommand {
  name = "create-role";
  aliases = ["cr"];
  description = "create custom role";

  async exec(msg: Message) {

    try {
      const roleName = await this.ask(msg, "The name of the role:");
      const roleColor = await this.ask(msg, "Role color (in hex i.e. #fff111 or BLUE):");
      const rolePriceStr = await this.ask(msg, "The role price:");
      const isExpires = await this.ask(msg, "With expiration?: [yes/no]");

      let rolePrice = this.validateAmount(rolePriceStr, Number.MAX_SAFE_INTEGER);

      const duration = isExpires === "yes" ? 30 * 24 * 60 * 1000 : 0;

      const guildRole = await msg.guild!.roles.create({
        name: roleName,
        color: roleColor as ColorResolvable,
        reason: `Coin shop new role`,
      });


      const role = new Role({
        roleID: guildRole.id,
        guildID: msg.guild!.id,
        duration: duration,
        price: rolePrice,
      });


      await role.save();

      msg.channel.send(`Succesfully created ${roleName}!`);

    } catch (err: any) {

      msg.channel.send(err.message);
    }
  }
}
