import { Message } from "discord.js";
import { EmbedTemplate } from "../structure/EmbedTemplate";
import { UserCommand } from "../structure/UserCommand";

export default class Withdraw extends UserCommand {
  name = "withdraw";
  aliases = ["wd"];
  description = "cash out";

  async exec(msg: Message, args: string[]) {
    const user = await this.getUser(msg.author.id);
    const arg1 = args[0];
    const template = new EmbedTemplate(msg);

    try { 

      if (arg1 === "all" && user.bank <= 0) 
        throw new Error("empty bank");

      const amount = this.validateAmount(arg1, user.bank); 
      user.bank -= amount;
      user.balance += amount;
      user.save();

      template.showSuccess(`Successfully withdrew $${amount}`);
    } catch (err: any) {
      template.showError(err.message);
      return;
    }
  }
}
