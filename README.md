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
- [Command Handling](#command-handling)
- [Command Loading](#command-loading)

## Getting Started
After requiring Quickcord in your app file, you can initalise the `Client` class with two constructor parameters. The first parameter is the token for your Discord bot which can be found on the [Discord Developer Portal](https://discord.com/developers/applications). The second parameter is your bot's activation prefix, this is the character which will be used to tell your bot that a user is running a command. Within Quickcord, you may use both a character and an array of different characters like so:

```js
const quickcord = require('quickcord');

// Using only one prefix
const bot = new quickcord.Client(process.env.TOKEN, '.');

// Using multiple prefixes
const bot = new quickcord.Client(process.env.TOKEN, ['.', '!']);
```

## Installation
Quickcord is available through NPM and Yarn. Simply run either command below in your terminal.

`npm i quickcord`
`yarn add quickcord`

## Interfaces
Within this section, I will define all of the important interfaces within Quickcord for reference later on.

### CommandOptions
```ts
interface CommandOptions {
    autoDelete?: Boolean,
    log?: Boolean,
    disabled?: Boolean,
    permittedRoles?: Array<Number>
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
    author?: Partial<MessageEmbedAuthor> & { icon_url?: string; proxy_icon_url?: string };
    thumbnail?: Partial<MessageEmbedThumbnail> & { proxy_url?: string };
    image?: Partial<MessageEmbedImage> & { proxy_url?: string };
    video?: Partial<MessageEmbedVideo> & { proxy_url?: string };
    footer?: Partial<MessageEmbedFooter> & { icon_url?: string; proxy_icon_url?: string };
}
```

## Embeds
Quickcord offers two types of embeds. The first being a standard [MessageEmbed](https://discord.js.org/#/docs/main/stable/class/MessageEmbed) and the other being Quickcord's very own embed paginator.

### Standard Embeds
Standard embeds are simply Discord.js [MessageEmbed's](https://discord.js.org/#/docs/main/stable/class/MessageEmbed). They can be used just as you would use them in Discord.js. A few examples are below.

```js
const { RichEmbed, Client } = require('quickcord');

const bot = new Client(process.env.TOKEN, '.');

bot.command('test', (res, args) => {
    const embed = new RichEmbed({
        title: 'Test',
        description: 'testing this',
        fields: [
            { name: 'field1', value: 'field1', inline: true },
            { name: 'field2', value: 'field2', inline: true }
        ]
    });

    res.channel.send(embed);
});
```

```js
const { RichEmbed, Client } = require('quickcord');

const bot = new Client(process.env.TOKEN, '.');

bot.command('test', (res, args) => {
    const embed = new RichEmbed();

    embed.setTitle('testing');
    embed.setDescription('testing this');

    res.channel.send(embed);
});
```

### Embed Pagination
The 6.1.0 release of Quickcord has bought the `EmbedPaginator` with it. This class allows you to create an embed just like normal, however, if you have a large number of fields that you want to display, you would have already realised this is limited to `25` by the default [MessageEmbed](https://discord.js.org/#/docs/main/stable/class/MessageEmbed) whereas, using the `EmbedPaginator`, you can provide as many fields as you would like and they will be split into pages which can be changed by reacting to the embed. 

Below is an example of how you may use the `EmbedPaginator`.

```js
const { EmbedPaginator, Client } = require('quickcord');

const bot = new Client(process.env.TOKEN, '.');

const fields = []; // An array that contains EmbedFields

bot.command('test', (res, args) => {
    new EmbedPaginator(res.channel, {
        title: 'testing',
        description: 'testing this',
        fields: fields
    });
});
```

The `EmbedPaginator` takes two parameters, the first being the channel to which you want to send the embed and the second being the [MessageEmbedOptions](#messageembedoptions).

## Command Handling
Quickcord offers a simply but unique command handler which is takes 2 parameters which are the command and a callback function which is called when the command has been triggered. The callback contains another 2 parameters which are `res` and `args`. `res` contains a [Message](https://discord.js.org/#/docs/main/stable/class/Message) interface which can be used to interact with many things such as the channel, permissions, content, etc. The second callback parameter simply contains arguements which were executed with your command on Discord.

Below is an example of how you may use command handling.

```js
const quickcord = require('quickcord');

const client = new quickcord.Client('token here', '.');

client.command('ping', (res, args) => {
    res.delete();

    res.channel.send('pong');
});
```

Additionally, the `command` method can also have a third parameter which is the [CommandOptions](#commandoptions) interface once again, this means you can also use options for simple commands that you want within your bot. Look at the example below for reference.

```js
const quickcord = require('quickcord');

const client = new quickcord.Client('token here', '.');

client.command('ping', (res, args) => {
    res.delete();

    res.channel.send('pong');
}, {
    autoDelete: true,
    log: true
});
```

## Command Loading
Quickcord also offers a command loader which will read inside a directory that you specify for valid `.ts` or `.js` file formats. Quickcord will then load the files in using a `require` function. This means that the file Quickcord is loading in must be in a specific format in-order for Quickcord to effectively load it. This format is specified in the example below.

```js
const command = (res, args) => {
    res.reply('pong');
}

module.exports = {
    aliases: ['ping', 'hi'],
    cb: command,
    options: {
        autoDelete: true,
        log: true
    }
}
```

Within the example above, there is a key called `aliases` this may be a string or an array which contain the commands which will be used to trigger your function. Following this is a key called `cb`, this is the callback function which will be called when the command is triggered, you may use either a normal function or arrow function. The final parameter is an object containing all of the possible options you could have for that specific command. You can check which options are available from within the [CommandOptions](#commandoptions) interface.

### Example
Below is an example of how you can use command loading to modularise your Discord bot. The `loadCommands` method takes two parameters, the first being the directory and the second being a callback function containing all of the files that were actually loaded using Quickcord.

```js
const { Client } = require('quickcord');

const bot = new Client(process.env.TOKEN, '.');

bot.loadCommands('./commands', files => {
    console.log(files);
});