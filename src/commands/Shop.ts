import { Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
import { BROWN, toNList } from "../structure/utils";
import { BaseArmor } from "../structure/Armor";
import { BasePet } from "../structure/Pet";
import { EmbedTemplate } from "../structure/EmbedTemplate";
import { Item } from "../structure/Item";


export default class extends UserCommand {
  name = "shop";
  description = "buy custom role and rpg stuff";

  async exec(msg: Message, args: string[]) {

    const embed = new EmbedTemplate(msg);
    const items = [
      ...BaseArmor.all,
      ...BasePet.all,
      ...Item.all,
    ];
    const rpgs = [
      ...BaseArmor.all,
      ...BasePet.all,
      ...Item.all,
    ];
    const [index] = args;


    if (index) {

      const selected = items.at(parseInt(index) - 1);

      if (!selected) {
        return embed.showError("no item found");
      }

      const info = selected.show();

      const button = new MessageButton()
        .setCustomId("buy")
        .setLabel("buy")
        .setStyle("PRIMARY");

      const row = new MessageActionRow()
        .addComponents(button);

      msg.channel.send({ embeds: [info], components: [row] });

      const filter = (i: MessageComponentInteraction) => {
        i.deferUpdate().catch(() => {});
        return i.user.id === msg.author.id;
      }

      const collector = msg.channel.createMessageComponentCollector({ max: 1, filter });

      collector.on("end", buttons => {
        const button = buttons.first();

        if (!button) return;

        selected.buy(msg);
      })

      return;
    }


    const rpgList = toNList(rpgs.map(x => `${x.name} \`${x.price} coins\``));

    const shop = new MessageEmbed()
      .setColor(BROWN)
      .setTitle("Shop")
      .setDescription(rpgList);

    msg.channel.send({ embeds: [shop] });
  }
}
