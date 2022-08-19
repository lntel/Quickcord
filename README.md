# Quickcord

Quickcord is a Discord.js wrapper which was inspired by express framework which enables developers to easily and quickly develop and deploy a Discord bot.

[![NPM](https://nodei.co/npm/quickcord.png)](https://nodei.co/npm/quickcord/)

![GitHub package.json version](https://img.shields.io/github/package-json/v/lntel/quickcord)
![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/lntel/quickcord/dev)
![GitHub issues](https://img.shields.io/github/issues/lntel/quickcord)
![GitHub stars](https://img.shields.io/github/stars/lntel/Quickcord?style=social)
![Discord](https://img.shields.io/discord/617003564434456588)

## Table of contents

- [Installation](#installation)
- [Interfaces](#interfaces)
  - [CommandOptions](#commandoptions)
  - [MessageEmbedOptions](#messageembedoptions)
- [Embeds](#embeds)
  - [Standard Embeds](#standard-embeds)
  - [Embed Pagination](#embed-pagination)
    - [Editing](#editing)
    - [Custom Pages](#custom-pages)
- [Command Handling](#command-handling)
- [Command Loading](#command-loading)

## Getting Started

After requiring Quickcord in your app file, you can initalise the `Client` class with two constructor parameters. The first parameter is the token for your Discord bot which can be found on the [Discord Developer Portal](https://discord.com/developers/applications). The second parameter is your bot's activation prefix, this is the character which will be used to tell your bot that a user is running a command. Within Quickcord, you may use both a character and an array of different characters like so:

```js
const quickcord = require("quickcord");

// Using only one prefix
const bot = new quickcord.Client(process.env.TOKEN, ".", {
  intents: ['Guilds', 'GuildMessages']
});

// Using multiple prefixes
const bot = new quickcord.Client(process.env.TOKEN, [".", "!"], {
  intents: ['Guilds', 'GuildMessages']
});
```

It is required to define intents such as *GUILDS* and *GUILD_MESSAGES* otherwise the bot will not be able to read any of the message object content or interact with the server. For a list of intents, take a look at [Discord's intent list](https://discord.com/developers/docs/topics/gateway#list-of-intents).

## Installation

Quickcord is available through NPM and Yarn. Simply run either command below in your terminal.

`npm i quickcord`
`yarn add quickcord`

## Interfaces

Within this section, I will define all of the important interfaces within Quickcord for reference later on.

### CommandOptions

Command options allow you to control how your command is processed and how the message is dealt with afterwards. I.e. Auto delete command trigger message. Since version 7.2.0, you can now use the `dm` option to define whether the command can be trigger through a direct message or not. This is set to false by default.

```ts
interface CommandOptions {
  autoDelete?: Boolean;
  log?: Boolean;
  disabled?: Boolean;
  dm?: Boolean;
  permittedRoles?: Array<Number>;
}
```

### MessageEmbedOptions

```ts
interface MessageEmbedOptions {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: Date | number;
  color?: ColorResolvable;
  fields?: EmbedFieldData[];
  files?: (MessageAttachment | string | FileOptions)[];
  author?: Partial<MessageEmbedAuthor> & {
    icon_url?: string;
    proxy_icon_url?: string;
  };
  thumbnail?: Partial<MessageEmbedThumbnail> & { proxy_url?: string };
  image?: Partial<MessageEmbedImage> & { proxy_url?: string };
  video?: Partial<MessageEmbedVideo> & { proxy_url?: string };
  footer?: Partial<MessageEmbedFooter> & {
    icon_url?: string;
    proxy_icon_url?: string;
  };
}
```

## Embeds

Quickcord offers two types of embeds. The first being a standard [MessageEmbed](https://discord.js.org/#/docs/main/stable/class/MessageEmbed) and the other being Quickcord's very own embed paginator.

### Standard Embeds

Standard embeds are simply Discord.js [MessageEmbed's](https://discord.js.org/#/docs/main/stable/class/MessageEmbed). They can be used just as you would use them in Discord.js. A few examples are below.

```js
const { RichEmbed, Client } = require("quickcord");

const bot = new Client(process.env.TOKEN, ".", {
  intents: [Intents.FLAGS.GUILDS],
});

bot.command("test", (res, args) => {
  const embed = new RichEmbed({
    title: "Test",
    description: "testing this",
    fields: [
      { name: "field1", value: "field1", inline: true },
      { name: "field2", value: "field2", inline: true },
    ],
  });

  res.channel.send(embed);
});
```

```js
const { RichEmbed, Client } = require("quickcord");

const bot = new Client(process.env.TOKEN, ".");

bot.command("test", (res, args) => {
  const embed = new RichEmbed();

  embed.setTitle("testing");
  embed.setDescription("testing this");

  res.channel.send(embed);
});
```

### Embed Pagination

The 6.1.0 release of Quickcord has bought the `EmbedPaginator` with it. This class allows you to create an embed just like normal, however, if you have a large number of fields that you want to display, you would have already realised this is limited to `25` by the default [MessageEmbed](https://discord.js.org/#/docs/main/stable/class/MessageEmbed) whereas, using the `EmbedPaginator`, you can provide as many fields as you would like and they will be split into pages which can be changed by reacting to the embed.

Below is an example of how you may use the `EmbedPaginator`.

```js
const { EmbedPaginator, Client } = require("quickcord");

const bot = new Client(process.env.TOKEN, ".", {
  intents: [Intents.FLAGS.GUILDS],
});

const fields = []; // An array that contains EmbedFields

bot.command("test", (res, args) => {
  new EmbedPaginator(res.channel, {
    title: "testing",
    description: "testing this",
    fields: fields,
  });
});
```

#### Editing

The EmbedPaginator class does not have to be reinitialized in-order for you to edit it, you may simply use the `edit` method as is shown below.

```js
const { Client, EmbedPaginator } = require("quickcord");

const bot = new Client(process.env.TOKEN, ".", {
  intents: [Intents.FLAGS.GUILDS],
});

bot.command("test", (res, args) => {
  const embed = new EmbedPaginator(res.channel, {
    title: "test",
    description: "testing the embed paginator",
  });

  setTimeout(() => {
    embed.edit({
      title: "this is a new title",
      description: "this is also a new desc",
      fields: [{ name: "we can also use these", value: "testing" }],
    });
  }, 3000);
});
```

#### Custom pages

Since 6.3.0 the EmbedPaginator class now allows you to provide a third parameter on initialization, this third parameter allows you to provide a `Pages` type which takes an array which contains arrays of `EmbedField` interfaces. An example is shown below in-order to demonstrate how you could potentially use this feature.

```js
const { Client, EmbedPaginator } = require('quickcord');

const bot = new Client(process.env.TOKEN, '.', {
  intents: [Intents.FLAGS.GUILDS],
});

const pages = [
    [
        { name: 'this is page 1', value: 'testing' }
        { name: 'this is also page 1', value: 'testing' }
    ],
    [
        { name: 'this is page 2', value: 'testing' }
        { name: 'this is also page 2', value: 'testing' }
    ]
];

bot.command('test', (res, args) => {
    new EmbedPaginator(res.channel, {
        title: 'test',
        description: 'testing the embed paginator'
    }, pages);
});
```

The `EmbedPaginator` takes two parameters, the first being the channel to which you want to send the embed and the second being the [MessageEmbedOptions](#messageembedoptions).

## Command Handling

Quickcord offers a simply but unique command handler which is takes 2 parameters which are the command and a callback function which is called when the command has been triggered. The callback contains another 2 parameters which are `res` and `args`. `res` contains a [Message](https://discord.js.org/#/docs/main/stable/class/Message) interface which can be used to interact with many things such as the channel, permissions, content, etc. The second callback parameter simply contains arguements which were executed with your command on Discord.

Below is an example of how you may use command handling.

```js
const quickcord = require("quickcord");

const client = new quickcord.Client("token here", ".");

client.command("ping", (res, args) => {
  res.delete();

  res.channel.send("pong");
});
```

Additionally, the `command` method can also have a third parameter which is the [CommandOptions](#commandoptions) interface once again, this means you can also use options for simple commands that you want within your bot. Look at the example below for reference.

```js
const quickcord = require("quickcord");

const client = new quickcord.Client("token here", ".");

client.command(
  "ping",
  (res, args) => {
    res.delete();

    res.channel.send("pong");
  },
  {
    autoDelete: true,
    log: true,
  }
);
```

## Command Loading

Quickcord also offers a command loader which will read inside a directory that you specify for valid `.ts` or `.js` file formats. Quickcord will then load the files in using a `require` function. This means that the file Quickcord is loading in must be in a specific format in-order for Quickcord to effectively load it. This format is specified in the example below.

As of version 7.0.0, if you are using typescript, it will no longer be necessary to define `./src` or `./dist`, these will be extracted automatically from the `tsconfig.json` file. An example of this is below:

Since version 8.0.0, the command loading function is now asynchronous and can either be used within a try-catch or promise chain. However, this method no longer returns an array of loaded files.

```ts
await bot.loadCommands("commands");
```

or alternatively, with a promise chain:

```ts
bot.loadCommands("commands").then(() => {
  console.log("Commands loaded");
});
```

```js
const command = (res, args) => {
  res.reply("pong");
};

module.exports = {
  aliases: ["ping", "hi"],
  cb: command,
  options: {
    autoDelete: true,
    log: true,
  },
};
```

Within the example above, there is a key called `aliases` this may be a string or an array which contain the commands which will be used to trigger your function. Following this is a key called `cb`, this is the callback function which will be called when the command is triggered, you may use either a normal function or arrow function. The final parameter is an object containing all of the possible options you could have for that specific command. You can check which options are available from within the [CommandOptions](#commandoptions) interface.

### Example

Below is an example of how you can use command loading to modularise your Discord bot. The `loadCommands` method takes two parameters, the first being the directory and the second being a callback function containing all of the files that were actually loaded using Quickcord.

```js
const { Client } = require("quickcord");

const bot = new Client(process.env.TOKEN, ".", {
  intents: [Intents.FLAGS.GUILDS],
});

bot.loadCommands("./commands", (files) => {
  console.log(files);
});
```
