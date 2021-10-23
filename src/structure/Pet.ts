import { Message } from "discord.js";
import { Pet } from "discordjs-rpg";
import { Player } from "./Player";

export abstract class BasePet extends Pet {
  abstract price: number;

  static get all(): BasePet[] {
    return [
      new Blob(),
      new Slime(),
      new Phoenix(),
      new Titanoboa(),
    ];
  }

  async buy(msg: Message) {

    const player = await Player.fromMember(msg.member!);

    if (player.balance < this.price) {
      msg.channel.send("Insufficient amount");
      return;
    }

    player.balance -= this.price;
    player.setPet(this);

    await player.save();
    msg.channel.send(`Successfully set **${this.name}** as pet`);
  }
}

export class Blob extends BasePet {
  name = "Blob";
  id = "blob";
  attack = 20;
  price = 13000;
}

export class Slime extends BasePet {
  name = "Slime";
  id = "slime";
  attack = 15;
  interceptRate = 0.2;
  price = 15000;
}

export class Phoenix extends BasePet {
  name = "Phoenix";
  id = "phoenix";
  attack = 15;
  interceptRate = 0.2;
  price = 15000;
}

export class Titanoboa extends BasePet {
  name = "Titan O Boa";
  id = "titan-o-boa";
  attack = 5;
  interceptRate = 0.4;
  price = 30000;
}
