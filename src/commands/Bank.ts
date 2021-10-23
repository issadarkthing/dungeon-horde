import { Message, MessageEmbed } from "discord.js";
import { UserCommand } from "../structure/UserCommand";

export default class Bank extends UserCommand {
  name = "bank";
  description = "show player's bank balance";

  async exec(msg: Message) {

    const user = await this.getUser(msg.author.id);

    const embed = new MessageEmbed()
      .setTitle("Bank summary")
      .setThumbnail(msg.author.displayAvatarURL())
      .addField("Bank", `$${user.bank}`, true)
      .addField("Cash", `$${user.balance}`, true)
      .addField("Total", `$${user.bank + user.balance}`, true)

    msg.channel.send({ embeds: [embed] });
  }
}
