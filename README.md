# What's this?
This is just the code of a discord bot from a [coding questions server](https://discord.com/invite/5JhyHte3QC) in spanish.

# Configure
If you want to configure this bot for your server you just need to add an `.env` file like this:
```js
TOKEN="6qrZcUqja7812RVdnEKjpzOL4CvHBFG" // remove this comments
DBURI="mongodb+srv://user:pass@server.mongodb.net/cluster?retryWrites=true&w=majority" // mongo db
CONFIG_PATH="config/test.jsonc" // json file for ids and more (path), the commands uses it (check the "Config" pulled apart if each command)
```

# Features

Each feature is in a file in the `bot_events` folder.

---

## Captcha

Generates a captcha when a user joins a server.

### Config:
* `config.guild_id`: Guild joins.
* `config.roles.default`: Role to add after captcha.
* `config.channles.logs.captchas`: Logs channel.

---

## Random

Generates random numbers with comand `/BR` or `/BigRandom`, it takes an option argument, a number this modes (add the letter at the end):
* **`l`**: By number length. Ej: `/BR 3l` ➔ `134`
* **`n`**: By number. Ej: `/BR 3n` ➔ `2`

### Config: Nothing

---

## Reccomendations

A reccomendations sistem with three channels: **from** (channel to **get** recommendations), **to** (channel to **send** redcommendations) and **todo** (channel to send **accepted** or **denied** recommendations);

### Config:
* `config.channles.recommendations.from`: Channel to **get** recommendations.
* `config.channles.recommendations.to`: Channel to **send** redcommendations.
* `config.channles.recommendations.todo`: Channel to send **accepted** or **denied** recommendations.

---

## Status

Create status channels with **members**, **verified**, and **bots** numbers.

### Config:
* `config.roles.default`: Role to check verified.
* `config.channels.stats.members`: Cannel to put the number (channel name before bot is on: `<custom name (members)>: ?`)
* `config.channels.stats.verified`: Cannel to put the number (channel name before bot is on: `<custom name> (verified): ?`)
* `config.channels.stats.bots`: Cannel to put the number (channel name before bot is on: `<custom name (bots)>: ?`)