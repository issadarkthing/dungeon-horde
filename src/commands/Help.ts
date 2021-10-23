import { Message } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
import { EmbedTemplate } from "../structure/EmbedTemplate";
import { commandManager } from "../index";
import { bold, inlineCode } from "../structure/utils";

export default class extends UserCommand {
  name = "help";
  aliases = ["h"];
  description = "show all commands and it's description";

  async exec(msg: Message) {
    const embed = new EmbedTemplate(msg);
    const commands = commandManager.commands.values();

    let helpText = "";
    const done = new Set<string>();

    for (const command of commands) {

      if (command.disable)
        continue;

      if (done.has(command.name)) {
        continue
      } else {
        done.add(command.name);
      }

      helpText += 
        `\n${bold(command.name)}: ${inlineCode(command.description || "none")}`;

    }

    embed.showInfo(helpText);
  }
}
