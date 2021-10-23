import { Message, MessageEmbed } from "discord.js";
import { Player } from "../structure/Player";
import { EmbedTemplate } from "./EmbedTemplate";
import { Item } from "./Item";
import { BROWN, inlineCode } from "./utils";


export class Chicken extends Item {
  id = "chicken";
  name = "Chicken";
  description = "to be used in chicken fight";
  price = 100;

  show() {

    const embed = new MessageEmbed()
      .setTitle("Chicken")
      .setColor(BROWN)
      .setDescription(this.description)
      .addField("Price", inlineCode(this.price))

    return embed;
  }

  async buy(msg: Message) {

    const embed = new EmbedTemplate(msg);
    const player = await Player.fromMember(msg.member!);

    if (player.balance < this.price) {
      embed.showError(`Insufficient balance`);
      return;
    }
      
    player.balance -= this.price;
    player.addInventory(this);

    await player.save();

    embed.showSuccess(`Successfully bought ${this.name}!`);
  }
}
