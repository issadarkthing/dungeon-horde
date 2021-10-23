import { UserCommand } from "../structure/UserCommand";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { Battle } from "discordjs-rpg";
import { sleep } from "../structure/utils";
import { EmbedTemplate } from "../structure/EmbedTemplate";

export default class extends UserCommand {
  name = "duel";
  description = "duel with your friend";

  async exec(msg: Message) {

    const embed = new EmbedTemplate(msg);
    const mention = msg.mentions.members?.first();
    const player = await Player.fromMember(msg.member!);

    if (!mention) {
      embed.error("please mention a player");
      return;
    }

    const opponent = await Player.fromMember(mention);
    const info = opponent.show().setTitle("Your opponent");

    const loading = await msg.channel.send({ embeds: [info] });
    await sleep(6);
    await loading.delete();

    const battle = new Battle(msg, [player, opponent]);
    await battle.run();

    return;

  }
}
