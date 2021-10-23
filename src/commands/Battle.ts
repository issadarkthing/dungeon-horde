import { UserCommand } from "../structure/UserCommand";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { Battle } from "discordjs-rpg";
import { Challenger } from "../structure/Challenger";
import { bold, sleep } from "../structure/utils";

export default class extends UserCommand {
  name = "battle";
  description = "rpg battle";

  async exec(msg: Message) {

    const mention = msg.mentions.members?.first();
    const player = await Player.fromMember(msg.member!);

    if (mention) {
      const opponent = await Player.fromMember(mention);
      const info = opponent.show().setTitle("Your opponent");

      const loading = await msg.channel.send({ embeds: [info] });
      await sleep(6);
      await loading.delete();

      const battle = new Battle(msg, [player, opponent]);
      await battle.run();

      return;
    }

    const challenger = new Challenger(player);
    const info = challenger.show().setTitle("Your opponent");

    const loading = await msg.channel.send({ embeds: [info] });
    await sleep(6);
    await loading.delete();

    const battle = new Battle(msg, [player, challenger]);
    const winner = await battle.run();

    if (winner.id === player.id) {

      const currLevel = player.level;
      player.addXP(challenger.xpDrop);
      player.balance += challenger.drop;
      await player.save();

      msg.channel.send(`${player.name} has earned ${bold(challenger.drop)} coins!`);
      msg.channel.send(`${player.name} has earned ${bold(challenger.xpDrop)} xp!`);

      if (currLevel !== player.level) {
        msg.channel.send(`${player.name} is now on level ${bold(player.level)}!`);
      }
    } 

  }
}
