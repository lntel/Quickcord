# Quickcord
Quickcord is a Discord.js wrapper which integrates express frameworks simplicity to enable you to quickly and easily set up a Discord bot with minimal effort.

[![npm version](https://badge.fury.io/js/quickcord.svg)](https://badge.fury.io/js/quickcord)
[![GitHub version](https://badge.fury.io/gh/lntel%2Fquickcord.svg)](https://badge.fury.io/gh/lntel%2Fquickcord)
[![Dependencies Badge](https://david-dm.org/lntel/Quickcord.svg)](https://github.com/lntel/Quickcord/blob/master/package.json)
![GitHub Release Date](https://img.shields.io/github/release-date/lntel/quickcord)
![GitHub](https://img.shields.io/github/license/lntel/quickcord)

## Table of contents
- [Installation](#installation)
- [Features](#features)
- [Getting Started](#getting-started)
- [Command Handling](#command-handling)
    - [Manual Handling](#manual-handling)
    - [Command Loading](#command-loading)
- [Embeds](#embeds)

## Installation
`$ npm install quickcord --save`

## Features
* Command Handling
    * Manual Handling
    * Command Loading
* Embeds

## Getting Started
Firstly, as a prerequisite you must have already created a Discord bot which you can do within the [Discord Developer Portal](https://discordapp.com/developers/applications/). Furthermore, you must require the Quickcord library from node_modules and instantiate the Quickcord client as is shown within the example below.

```js
const Quickcord = require('quickcord');

// Using an array of prefixes
const client = new Quickcord.Client('discordBotToken', ['!', '.']);

// Using a single prefix
const client = new Quickcord.Client('discordBotToken', '.');
```

When instantiating the Quickcord client, there are two parameters which you must provide, the first being the Discord bot token and the second being either a string containing you bot prefix or an array containing multiple prefixes.

## Command Handling
Command handling within Quickcord allows you to quickly create a response to a command for your Discord bot. Within Quickcord so far there are two methods for handling commands. These two methods are Manual Handling and Command Loading. Manual Handling is good for creating a quick yet robust solution however, it currently lacks features which Command Loading offers such as disabling commands and manual command deletion.

### Manual Handling
Here is an example of Manual Handling.
```js
const Quickcord = require('quickcord');

const client = new Quickcord.Client('DiscordBotToken', '.');

// Here is a single command
client.command('ping', (res, args) => {
    // Reply to the user with pong
    res.reply('pong');
});
```

### Command Loading
Command Loading offers a number of additional features in comparison to Manual Handling as mentioned above. With Command Loading, it is suggested that you create a new directory called `commands` within your application. This will be where you store all of your command files.

Each command file must be layed out as is shown within the example below.
```js
module.exports = {
    aliases: ['help', 'commands'],
    callback: (res, args) => {
        res.reply("This is a help commands");
    }
};
```

Aliases refers to what the user must type in-order to trigger the command callback. For example, if the user within Discord types: `.help` or `.commands`, this command callback would be triggered. Aliases can either be a single command or multiple, it is completely up to you.

Callback is the function which is called when the command is triggered. This methods has two parameters, the first being the [message response](https://discord.js.org/#/docs/main/stable/class/Message) and the second being everything seperated by a space after the command.

Furthermore, using the command loader allows you to use additional options such as automatic command deletion and permitted role checks.

```js
module.exports = {
    aliases: ['help', 'commands'],
    permittedRoles: ['672126724430888960'],
    disabled: true,
    deleteCommand: true,
    logging: true,
    callback: (res, args) => {
        res.reply("This is a help commands");
    }
};
```

Now it comes to actually loading the commands in from your main app file. This is performed as is show below.

```js
const Quickcord = require('quickcord');

const client = new Quickcord.Client('DiscordBotToken', '.');

client.loadCommands('./commands');
```

In the example above, commands are being loaded from the `commands` directory. This can be named whatever you wish however, you must also change the name within the command loading parameter.

## Embeds
Embeds within Quickcord are extremely simple. An embed takes a single parameter which is an object which follows the basis of the Discord.js [Rich Embed](https://discord.js.org/#/docs/main/stable/class/RichEmbed) Creating embeds is achieved as is shown within the example below.

```js
const Quickcord = require('quickcord');

const embed = Quickcord.Embed({
    title: 'Quickcord Embed',
    description: 'This is a Quickcord embed',
    fields: [
        { name: 'Test field name', value: 'Test field value' },
        { name: 'Test field name', value: 'Test field value' }
    ],
    footer: 'This is a footer'
})
```

## License
[MIT](https://github.com/lntel/Quickcord/blob/master/LICENSE)