import { Client } from "discord.js";
import { CommandManager } from "@jiman24/commandment";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const COMMAND_PREFIX = process.env.PREFIX || "!";
export const client = new Client({ intents: [
  "GUILDS", 
  "GUILD_MESSAGES", 
  "GUILD_MEMBERS",
  "DIRECT_MESSAGES",
] });

export const commandManager = new CommandManager(COMMAND_PREFIX);

commandManager.verbose = true;
commandManager.registerCommands(path.resolve(__dirname, "./commands"));
commandManager.registerCommandOnThrottleHandler((msg, cmd, timeLeft) => {
  const time = Math.round(timeLeft / 1000);
  msg.channel.send(`You cannot run ${cmd.name} command after ${time} s`);
});

process.on("uncaughtException", () => {});

client.on("ready", () => {
  console.log(client.user?.username, "is ready!");
})

client.on("messageCreate", msg => { 

  if (!msg.guild) return;

  commandManager.handleMessage(msg);

});

client.login(process.env.BOT_TOKEN);
mongoose.connect(process.env.DB_URI!)
  .then(() => console.log("connected to database"));
