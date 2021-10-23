import { Message } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
import { random } from "../structure/utils";
import { EmbedTemplate } from "../structure/EmbedTemplate";

export default class Slut extends UserCommand {
  name = "slut";
  min = 20;
  max = 50;
  disable = true;
  successRate = 0.65;
  throttle = 20 * 1000; // 20 seconds
  description = "attempt to slut";

  async exec(msg: Message) {

    const user = await this.getUser(msg.author.id);
    const earned = random().integer(this.min, this.max);
    const isSuccess = random().bool(this.successRate);
    const template = new EmbedTemplate(msg);

    if (isSuccess) {
      user.balance += earned;
      await user.save();
      const message = `You earned $${earned}!`;
      template.showSuccess(message);
    } else {
      template.showError(`Slut attempt failed`);
    }
  }
}
