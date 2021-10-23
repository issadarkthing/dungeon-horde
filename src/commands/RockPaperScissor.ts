import { Message, MessageActionRow, MessageButton, MessageComponentInteraction, Collection } from "discord.js";
import { UserDocument } from "../database/User";
import { EmbedTemplate } from "../structure/EmbedTemplate";
import { Options, Result, RockPaperScissors } from "../structure/RockPaperScissor";
import { UserCommand } from "../structure/UserCommand";

export default class extends UserCommand {
  name = "rock-paper-scissor";
  aliases = ["rps"];
  description = "play rock paper scissors like the old days";
  
  async exec(msg: Message, args: string[]) {

    const [arg1] = args;
    const embed = new EmbedTemplate(msg);
    const mentions = msg.mentions.members;
    const opponent = mentions?.first();

    if (!opponent)
      return embed.showError(`You need to mention a player`);

    const p1 = await this.getUser(msg.author.id);
    const p2 = await this.getUser(opponent.id);
    let amount = 0;
    const players = new Collection<string, UserDocument>();
    players.set(p1.userID, p1);
    players.set(p2.userID, p2);

    try {
      amount = this.validateAmount(arg1, p1.balance);
      amount = this.validateAmount(arg1, p2.balance);

    } catch (err: any) {
      embed.showError(err.message);
      return;
    }

    const rock = new MessageButton()
      .setCustomId(Options.ROCK)
      .setLabel("Rock")
      .setStyle("PRIMARY");

    const paper = new MessageButton()
      .setCustomId(Options.PAPER)
      .setLabel("Paper")
      .setStyle("PRIMARY");

    const scissors = new MessageButton()
      .setCustomId(Options.SCISSORS)
      .setLabel("Scissors")
      .setStyle("PRIMARY");

    const row = new MessageActionRow()
      .addComponents(rock, paper, scissors);

    const message = await msg.channel.send({ content: "Please select", components: [row] });

    const filter = (i: MessageComponentInteraction) => {
      i.deferUpdate().catch(() => {});
      return i.user.id === msg.author.id || i.user.id === opponent.id;
    };

    const collector = msg.channel.createMessageComponentCollector({ filter, max: 2 });

    collector.on("end", async (buttons) => {
      const [[, button1], [, button2]] = buttons;

      if (!button1 || !button2) {
        embed.showError("no response");
        return
      }

      const result = RockPaperScissors.play(
        button1.customId as Options,
        button2.customId as Options,
      );
        
      embed.showInfo(`${button1.user.username} chosed ${button1.customId}`);
      embed.showInfo(`${button2.user.username} chosed ${button2.customId}`);

      if (result === Result.WIN) {
        embed.showSuccess(`${button1.user.username} wins ${amount} coins`)
        const p1 = players.get(button1.user.id)!;
        const p2 = players.filter(x => x.userID !== p1.userID).first()!;
        p1.balance += amount;
        p2.balance -= amount;

        await p1.save();
        await p2.save();

      } else if (result === Result.DRAW) {
        embed.showSuccess("Draw!");
      } else if (result === Result.LOSE) {
        embed.showSuccess(`${button2.user.username} wins ${amount} coins`);
        const p1 = players.get(button1.user.id)!;
        const p2 = players.filter(x => x.userID !== p1.userID).first()!;
        p1.balance -= amount;
        p2.balance += amount;

        await p1.save();
        await p2.save();
      }

      await message.delete();
    })


  }
}
