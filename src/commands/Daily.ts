import { Message } from "discord.js";
import { EmbedTemplate } from "../structure/EmbedTemplate";
import { UserCommand } from "../structure/UserCommand";
import { DateTime } from "luxon";

export default class Daily extends UserCommand {
  name = "daily";
  amount = 200;
  description = "claim your daily coin";

  async exec(msg: Message) {

    const user = await this.getUser(msg.author.id);
    const now = DateTime.now();
    const template = new EmbedTemplate(msg);

    if (user.lastDailyClaim) {
      const lastClaimed = DateTime.fromJSDate(user.lastDailyClaim);
      const nextClaim = lastClaimed.plus({ days: 1 });

      if (nextClaim > now) {
        const timeLeft = nextClaim.toRelative({ unit: "hours" });
        template.showError(`You can claim again ${timeLeft}`);
        return;
      }
    }

    user.lastDailyClaim = now.toJSDate();
    user.balance += this.amount;
    await user.save();

    template.showSuccess(`You have claimed your daily $${this.amount}!`);
  }
}
