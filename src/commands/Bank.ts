import { Message, MessageEmbed } from "discord.js";
import { UserCommand } from "../structure/UserCommand";

export default class Bank extends UserCommand {
  name = "bank";
  description = "show player's bank balance";

  async exec(msg: Message) {

    const user = await this.getUser(msg.author.id);

    const embed = new MessageEmbed()
      .setTitle("User profile")
      .setThumbnail(msg.author.displayAvatarURL())
      .addField("Name", msg.author.username, true)
      .addField("Bank", `$${user.bank}`, true)
      .addField("Cash", `$${user.balance}`, true)
      .addField("Total", `$${user.bank + user.balance}`)

    msg.channel.send({ embeds: [embed] });
  }
}
