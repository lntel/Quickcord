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
- [Getting Started](#getting-started)
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

## Command Loading
Quickcord also offers a command loader which will read inside a directory 