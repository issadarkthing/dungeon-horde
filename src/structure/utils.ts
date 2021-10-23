import { DMChannel, TextChannel } from "discord.js";
import { Random, MersenneTwister19937 } from "random-js";

export const random = () => new Random(MersenneTwister19937.autoSeed());

export function inlineCode(str: string | number) {
  return `\`${str}\``;
}

export function bold(str: string | number) {
  return `**${str}**`;
}

export function sleep(seconds: number) {
  return new Promise(res => {
    setTimeout(res, seconds * 1000);
  })
}

export function toNList(items: string[], start = 1) {
  if (items.length < 0) return "none";
  return items.map((x, i) => `${i + start}. ${x}`).join("\n");
}

export function chunk<T>(arr: T[], chunkSize: number) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

export async function nukeChannel(channel: TextChannel | DMChannel) {
  let deleted = 0;
  do {
    const messages = await channel.messages.fetch({ limit: 100 });
    for (const message of messages.values()) {
      await message.delete();
    }
    deleted = messages.size;
  } while (deleted > 0);
}

export const RED = "#FF0000";
export const GREEN = "#008000";
export const GOLD = "#ffd700";
export const BROWN = "#c66a10";
export const SILVER = "#c0c0c0";
