import { Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
import { GREEN, random } from "../structure/utils";

export default class CoinDrop extends UserCommand {
  name = "drop";
  amount = random().integer(1000, 3000);
  disable = true;
  spawnAt = 500;

  exec(msg: Message) {

    const btn = new MessageButton()
      .setCustomId("collect")
      .setLabel("collect")
      .setStyle("PRIMARY");

    const row = new MessageActionRow()
      .addComponents(btn);

    const embed = new MessageEmbed()
      .setColor(GREEN)
      .setTitle("Treasure chest has been found!")
      .setDescription("Claim before someone does it first!")
      .setImage("https://cdn.discordapp.com/attachments/884268778047828073/889011028208267274/image-removebg-preview.png")

    msg.channel.send({ embeds: [embed], components: [row] });

    const collector = msg.channel.createMessageComponentCollector({ max: 1 });

    const getUser = this.getUser;

    collector.on("end", async i => {
      const button = i.first();

      if (!button) return; 
      
      const player = await getUser(button.user.id);

      player.balance += this.amount;
      await player.save();

      embed.setDescription(
        `${button.member} claimed coin drop worth ${this.amount} coins!`
      );

      button.update({ embeds: [embed], components: [] })
        .catch(() => {})
    })
  }
}
