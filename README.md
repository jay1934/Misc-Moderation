<div align="center">

![](/assets/banner.png)

[Installation](#Installation) • [How to Use](#How-to-Use)

---

## Installation

</div>

##### Prerequisite

- To use this bot, Node.js 12.0.0 or newer must be [installed](https://nodejs.org/en/download/).

##### Downloading and installing steps

1.  **[Download](https://github.com/jay1934/Misc-Moderation/archive/main.zip)** the `zip` file.

2.  Configure the Bot:

    - Run `npm i`
    - You will need to [create a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) in the **[developers space](https://discordapp.com/developers/applications/me)**
    - Make sure you enable the `GUILD_MEMBERS` and `GUILD_PRESENCES` intents
    - Replace the placeholders in [`config.json`](/config.json) with your preffered settings.

3.  Invite the Bot to your Server:

    - In your bot's application page, navigate to [OAUTH2](https://discord.com/developers/applications/771430839250059274/oauth2)
    - In the "scopes" section, select `bot`
    - In the "bot permission" section, select:

      - `ADMINISTRATOR`

      This will account for permissions needed on all three features.

    - Copy and paste the generated invite link!

4.  Get the Bot Online
    - Run `node index.js`
    - **The bot is now operational ! 🎉**

<br>

---

<div align="center">

## How to Use

</div>

### Giveaways

<br>

I made the giveaway system as easy and seemless as possible. To start a giveaway, just use the start command in this format:

```
-start #channel <duration> <number of winners> <prize>

-start #example 24h 1 Discord Nitro!
```

Rerolling a giveaway is just as easy! You can specify the giveaway to reroll by prize, or by [message ID](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).

```
-reroll <prize or message ID>

-reroll Discord Nitro!
```

Finally, to end a giveaway early, you shuld use the same format as the reroll command.

```js
-end <prize or message ID>

-end Discord Nitro!
```

---

### Invites

<br>

Whenever somebody joins, the bot will track who created the invite that the member joined from, and add the newly joined member to the invite creator's list of invitees.

<br>

When a user leaves, they will be removed from the list of invitees, which will keep everything up to date. To track how many invites someone has, you can mention them (or use their user ID if you want to prevent unneeded pings) in the invites command.

```
-invites <@mention or ID>

-invites @Lioness100
```

To clear their invites, you can use the same format.

```js
-clearinvites <@mention or ID>
-clearinvites @Lioness100
```

---

### Banning and Muting

<br>

Banning and muting users will add custom roles specified in [`config.json`](/config.json) to the user for the specified amount of time. The format they share is:

```
-ban <@mention or ID> <duration> [reason]

-ban @Lioness100 24h being rude
```

After either of these commands are sent:

- All roles will be removed from the user and stored in a database
- The custom role is added
- All messages sent by the user in the last 24 hours will be deleted (bot must be online for at least 24 hours without reset for this to work)
- A timer is started
- A message is sent in the channel the command was sent
- A message is sent in the specified log channel
- A message is DMd to the target
- The timer runs out
- The user's roles are restored
- A message is sent to the specified log channel

---

### Kicking

<br>

Kicking a user will _actually_ kick them (no custom roles this time), although it still shares a few of the same steps from the previous commands.

```
-kick <@mention or ID> [reason]

-kick @Lioness100 spamming
```

- A message is sent in the channel the command was sent
- A message is sent in the specified log channel
- A message is DMd to the target

---

### Warnings

You can warn people using the warn command in this format:

```
-warn <@mention or ID> <warning>

-warn @Lioness100 being obnoxious
```

After this is triggered:

- A message is sent in the channel the command was sent
- A message is sent in the specified log channel
- A message is DMd to the target

<br>

Once somebody has at least one warning, you can use the warning command, which will bring up an embed visualizer of every one of that member's warns in order.

```
-warnings <@mention or ID>

-warnings @Lioness100
```

As mentioned earlier, there will be numbers next to all of the corresponding warnings. You can use the clear warnings command to clear specific ones.

```
-clearwarnings <@mention or ID> <warn index(es)>

-clearwarnings @Lioness100 2
-clearwarnings @Lioness100 1, 5, 3
```

To clear _all_ warnings, use the clear all warnings command (expertly named, I know).

```
-clearallwarnings <mention or ID>

-clearallwarnings @Lioness100
```

---

### Announcements

The announcements command is probably the easiest command here. Just mention the channel to announce to, and say your announcement!

```
-announce #channel <announcement>

-announce #example I like trains
```
