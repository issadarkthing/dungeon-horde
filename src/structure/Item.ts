import { Message, MessageEmbed } from "discord.js";



export abstract class Item {
  abstract name: string;
  abstract id: string;
  abstract price: number;
  abstract show(): MessageEmbed;
  abstract buy(msg: Message): void;

  static get all(): Item[] {
    const { Chicken } = require("./Chicken");
    return [
      new Chicken(),
    ];
  }
}
