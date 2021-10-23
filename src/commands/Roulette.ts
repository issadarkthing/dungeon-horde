import { Message } from "discord.js";
import { EmbedTemplate } from "../structure/EmbedTemplate";
import { UserCommand } from "../structure/UserCommand";
import { random } from "../structure/utils";

export default class extends UserCommand {
  name = "roulette";
  description = "play roulette and earn money";

  async exec(msg: Message, args: string[]) {

    const [arg1, arg2] = args;
    const embed = new EmbedTemplate(msg);

    if (!arg1) {
      return embed.showError("You must place a bet");
    } else if (!arg2) {
      return embed.showError("You must specify space");
    }

    let amount = 0;
    const player = await this.getUser(msg.author.id);

    try {
      amount = this.validateAmount(arg1, player.balance);

    } catch (err: any) {
      return embed.showError(err.message);
    }

    let multiplier = 1;
    const chosenNumber = random().integer(1, 36);
    const color = random().pick(["black", "red"]);

    player.balance -= amount;

    if (chosenNumber.toString() === arg2) {
      multiplier++;
    }

    if (color === arg2) {
      multiplier++;
    }

    if (multiplier > 1) {
      const winAmount = amount * multiplier;
      embed.showSuccess(`You have won ${winAmount}!`);
      player.balance += winAmount;

    } else {
      embed.showError(`You have lost ${amount}`);

    }

    player.save();
  }
}
