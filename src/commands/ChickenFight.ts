import { UserCommand } from "../structure/UserCommand";
import { Message } from "discord.js";
import { EmbedTemplate } from "../structure/EmbedTemplate";
import { random, sleep } from "../structure/utils";
import { Player } from "../structure/Player";
import { Chicken } from "../structure/Chicken";

export default class extends UserCommand {
  name = "chicken-fight";
  aliases = ["cf"];
  description = "fight but with chicken";
  disable = true;
  winningChance = 0.65;

  async exec(msg: Message, args: string[]) {

    const embed = new EmbedTemplate(msg);
    const player = await Player.fromMember(msg.member!);
    const [arg1] = args;
    const chicken = player.inventory.filter(x => x.id === (new Chicken()).id);

    if (chicken.length < 1) {
      embed.showError(`You have no chicken left!`);
      return;
    }

    let amount = 0;

    try {

      amount = this.validateAmount(arg1, player.balance);

    } catch (err: any) {
      embed.showError(err.message);
      return;
    }


    const loadingMessage = await embed.showInfo("Fighting..");

    player.removeInventory(new Chicken());

    await sleep(4);
    await loadingMessage.delete();

    const win = random().bool(this.winningChance);

    if (win) {
      embed.showSuccess(`Your chicken wins! you earned ${amount * 2}!`);
      player.balance += amount;

    } else {
      embed.showError(`Your chicken died! you lost ${amount}!`);
      player.balance -= amount;

    }

    player.save();
  }
}
