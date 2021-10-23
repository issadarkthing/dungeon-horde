import { Message } from "discord.js";
import { EmbedTemplate } from "../structure/EmbedTemplate";
import { Button, UserCommand } from "../structure/UserCommand";
import { random, sleep } from "../structure/utils";

export default class Balance extends UserCommand {
  name = "color";
  description = "color game";
  colors = {
    green: "🍏",
    yellow: "🌻",
    blue: "📘",
    red: "🍎",
    pink: "🌸",
  };

  async exec(msg: Message, args: string[]) {

    const user = await this.getUser(msg.author.id);
    const emojis = Object.values(this.colors);
    const embed = new EmbedTemplate(msg);
    const text = "Please select";
    const buttons: Button[] = [];
    const [arg1] = args;
    let amount = 10;

    try {
      amount = this.validateAmount(arg1, user.balance);
    } catch (err: any) {
      embed.showError(err.message);
      return;
    }

    for (const [, value] of Object.entries(this.colors)) {
      buttons.push({
        id: value,
        label: value,
      })
    }

    const result = await this.collect(msg, text, buttons, { multi: true });
    const waiting = await embed.showInfo("picking...");

    await sleep(4);
    await waiting.delete();

    const selected = random().sample(emojis, 3);
    msg.channel.send(selected.join(" "));

    for (const [member, memberSelected] of result) {
      let multiplier = 1;
      const player = await this.getUser(member.id);

      if (player.balance < amount) {
        msg.channel.send(`${member.displayName} insufficient balance`);
        continue
      }

      player.balance -= amount;

      for (const emoji of memberSelected) {
        if (selected.includes(emoji)) {
          multiplier++;
        }
      }


      if (multiplier > 1) {
        const winAmount = multiplier * amount;
        embed.showSuccess(`${member.displayName} has earned ${winAmount}!`);
        player.balance += winAmount;

      } else {
        embed.showError(`${member.displayName} has lost ${amount}!`);

      }
    }

  }
}
