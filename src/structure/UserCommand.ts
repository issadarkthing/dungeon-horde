import { Command } from "@jiman24/commandment";
import { GuildMember, Message, MessageActionRow, MessageButton, MessageCollector } from "discord.js";
import { User } from "../database/User";

export interface Button {
  id: string;
  label: string;
}

export interface CollectOptions {
  timeout: number;
  multi: boolean;
}

export abstract class UserCommand extends Command {

  /**
   * Helper method to reduce the boilerplate of validating the argument given by
   * user. It checks if the argument was given, if the argument is valid number
   * (i.e. not negative and floating number), and check if it exceeds
   * maxAmount.
   * */
  validateAmount(arg: string | undefined, maxAmount: number) {
    if (!arg) throw new Error("no amount given");

    const amount = parseInt(arg);

    if (arg !== "all") {
      if (Number.isNaN(amount) || !Number.isInteger(amount)) {
        throw new Error("invalid amount given");
      } else if (amount <= 0) {
        throw new Error("negatives and zeros is not allowed");
      } else if (amount > maxAmount) {
        throw new Error("insufficient amount");
      }

      return amount;
    }

    return maxAmount;
  }


  async collect(
    msg: Message, 
    text: string,
    buttons: Button[], 
    option?: Partial<CollectOptions>,
  ) : Promise<Map<GuildMember, string[]>> {

    const row = new MessageActionRow()

    for (const button of buttons) {

      const btn = new MessageButton()
        .setCustomId(button.id)
        .setLabel(button.label)
        .setStyle("PRIMARY");

      row.addComponents(btn);
    }

    const seconds = option?.timeout || 20;

    const message = await msg.channel
      .send({ content: text, components: [row] });

    const collector = msg.channel
      .createMessageComponentCollector({ time: seconds * 1000 });

    const result = new Map<GuildMember, string[]>();

    collector.on("collect", button => {
      const { member, customId: id } = button;

      if (member instanceof GuildMember) {

        if (result.has(member) && option?.multi) {
          result.get(member)?.push(id);
        } else if (result.has(member)) {
           
          const selected = result.get(member)!;
          button.reply({ 
            content: `You already chosen ${selected}`, 
            ephemeral: true,
          });

          return;
        } else {
          result.set(member, [id]);
        }

        button.reply({ 
          content: `You clicked ${id}`, 
          ephemeral: true,
        })
        .catch(() => {})
      }

    })

    return new Promise(res => {
      collector.on("end", async () => { 
        await message.delete();
        res(result);
      });
    })
  }

  async ask(msg: Message, text: string) {

    await msg.channel.send(text);

    const filter = (response: Message) => response.author.id === msg.author.id;
    const collector = new MessageCollector(
      msg.channel, 
      { time: 30 * 1000, filter, max: 1 },
    );

    return new Promise<string>((resolve, reject) => {
      collector.on("end", results => {
        const result = results.first();
        if (!result) {
          reject("no input was given");
          return;
        }

        resolve(result.content);
      })
    })
  }

  async getUser(userID: string) {
    let user = await User.findByUserID(userID);

    if (!user) {
      user = new User({ userID });
      await user.save();
    }

    return user;
  }
}
