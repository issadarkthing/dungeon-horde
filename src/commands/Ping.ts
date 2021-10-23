import { Message } from "discord.js";
import { EmbedTemplate } from "../structure/EmbedTemplate";
import { UserCommand } from "../structure/UserCommand";

export default class extends UserCommand {
  name = "ping";
  description = "ping NASA";

  async exec(msg: Message) {
    const embed = new EmbedTemplate(msg);
    embed.showError("pong");
  }
}
