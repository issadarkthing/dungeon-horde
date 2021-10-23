import { Message } from "discord.js";
import { EmbedTemplate } from "../structure/EmbedTemplate";
import { UserCommand } from "../structure/UserCommand";

export default class Deposit extends UserCommand {
  name = "deposit";
  aliases = ["depo"];
  description = "deposit to bank";

  async exec(msg: Message, args: string[]) {
    const user = await this.getUser(msg.author.id);
    const arg1 = args[0];
    const template = new EmbedTemplate(msg);

    try { 

      if (arg1 === "all" && user.balance <= 0) 
        throw new Error("empty balance");

      const amount = this.validateAmount(arg1, user.balance); 
      user.balance -= amount;
      user.bank += amount;
      user.save();

      template.showSuccess(`Successfully deposited $${amount}`);
    } catch (err: any) {
      template.showError(err.message);
      return;
    }
  }
}
