import { UserCommand } from "../structure/UserCommand";
import { Message } from "discord.js";
import { EmbedTemplate } from "../structure/EmbedTemplate";
import { random } from "../structure/utils";

export default class extends UserCommand {
  name = "rob";
  throttle = 60 * 1000; // 1 minute
  description = "attempt rob";

  async exec(msg: Message) {

    const mentionedMember = msg.mentions.members?.first();
    const embed = new EmbedTemplate(msg);

    if (!mentionedMember) {
      return embed.showError("You need to mention a user");
    }

    const player = await this.getUser(msg.author.id);
    const target = await this.getUser(mentionedMember.id);
    const playerNetWorth = player.balance + player.bank;

    const chance = 1 - (playerNetWorth / (target.balance + playerNetWorth));
    const success = random().bool(chance);
    const amount = Math.round(chance * target.balance);

    if (success) {
      embed.showSuccess(`Successfully robbed ${amount} from ${mentionedMember}!`);
      target.balance -= amount;
      player.balance += amount;

      await player.save();
      await target.save();

    } else {
      embed.showError(`Rob attempt failed! You are fined for ${amount}`);

      if (player.balance >= amount) {
        player.balance -= amount;
      } else {
        player.balance = 0;
      }

      player.save();
    }
  }
}
