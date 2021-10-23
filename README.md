# RisingStar-PH

## Setting up

1. unzip file
2. run `npm install` or `yarn install`
3. add `.env` file
4. run `npm run build`
5. run `npm run start`


## Create a bot
You need to have a bot by using your own discord account. You can find the guide
to create bot application
[here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot).
After that, you need to grab the bot's token and follow the next step.


## .env file content
The `.env` file contains configuration for your bot. This includes your bot
token, bot's prefix and mongodb uri.

```
BOT_TOKEN=<your bot token>
DB_URI=<your mongodb uri>
PREFIX=<your bot prefix>
VERFIED_ROLE_ID=<role given after user passed captcha test>
LEADERBOARD_CHANNEL_ID=<leaderboard channel id>
GUILD_ID=<channel id>
```

## Basic

By default the bot's command is `!`. To see all available commands, use `!help`
or `!h`.

## Customization

There is always an open room for customization. You can modify files in the
`src/structure` or `src/commands` directory.
