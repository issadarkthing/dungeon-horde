import { Guild, Message, MessageEmbed, TextChannel } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
import { User } from "../database/User";
import { chunk } from "../structure/utils";
import { Pagination } from "discordjs-v13-button-pagination";
import { stripIndents } from "common-tags";
//@ts-ignore
import Table from "table-layout";

export default class extends UserCommand {
  name = "leaderboard";
  aliases = ["l"];
  description = "Leaderboard of most richest player";

  async getList(guild: Guild) {

    const users = await User.find();

    users.sort((a, b) => (b.balance + b.bank) - (a.balance + a.bank));

    await guild.members.fetch();
    const members = guild.members.cache;

    return users
      .filter(x => members.has(x.userID))
      .map((x, i) => ({ 
        rank: i + 1, 
        balance: x.balance + x.bank,
        user: members.get(x.userID)!.displayName,
      }));
  }

  async create(guild: Guild) {

    const list = (await this.getList(guild)).slice(0, 100);
    const data = new Table(list, { minWidth: 5 });

    const embed = new MessageEmbed()
      .setColor("BLUE")
      .setTitle("Leaderboard")
      .setDescription(
        stripIndents`
          \`\`\`yaml
          Rank | Coins | Users
          ===============================================
          ${data.toString()}
          \`\`\`
        `
      );

    return embed;
  }

  async exec(msg: Message) {

    const list = await this.getList(msg.guild!);

    const embeds = chunk(list, 10)
      .map(x => {
        const data = new Table(x, { minWidth: 5 });
        const embed = new MessageEmbed()
          .setTitle("Leaderboard")
          .setDescription(
            stripIndents`
            \`\`\`yaml
            Rank | Coins | Users
            ===============================================
            ${data.toString()}
            \`\`\`
            `
          )

        return embed;
      })

    const pagination = new Pagination(
      msg.channel as TextChannel, 
      embeds, 
      "page",
    );

    try {
      await pagination.paginate();
    } catch {}
  } 
}
