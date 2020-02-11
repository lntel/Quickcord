# Quickcord
Quickcord is a Discord.js wrapper which integrates express frameworks simplicity to enable you to quickly and easily set up a Discord bot with minimal effort.

[![NPM](https://nodei.co/npm/quickcord.png)](https://nodei.co/npm/quickcord/)

![npm](https://img.shields.io/npm/v/quickcord)
![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/lntel/quickcord/dev?color=EF7B3C)
![npm](https://img.shields.io/npm/dt/quickcord)
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
- [Api Manager](#api-manager)
    - [RESTful](#restful)
        - [Usage Example](#usage-example)
- [License](#license)

## Installation
`$ npm install quickcord --save`

## Features
* Command Handling
    * Manual Handling
    * Command Loading
* Api Management
    * RESTful
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

## Api Manager
Coming in [v5.2.0](https://www.npmjs.com/package/quickcord/v/5.2.0) is the Api Manager. This allows you to provide a given api within the Api constructor and then easily access all of the endpoints within your Api using a range of HTTP verbs (supported verbs listed below). As of yet, only RESTful Api's are supported however, I hope to support GraphQL and others in future versions.

The Api Manager is built on top of [node-fetch](https://www.npmjs.com/package/node-fetch) and therefore, if you are familiar with either fetch or node-fetch you will find it much easier to use however, this wrapper has made it easier regardless.

### RESTful
As stated above, the Quickcord Api Manager supports RESTful Api's as I shall demonstrate within an example below.

Supported HTTP verbs:
* GET
* POST
* PUT
* PATCH
* DELETE

### Usage Example
```js
const Quickcord = require('quickcord');

// Connect the bot to Discord with prefix
const client = new Quickcord.Client('bot_token_here', '.');

// New const containing the Api instance
const Api = new Quickcord.Api('http://localhost:5000/v1');

// Create a command
client.command('test', (res, args) => {
    // Send a POST request to the /user endpoint
    Api.post('/user', {
        // Include our post data here, it will be automatically serialized
        username: 'test',
        password: 'testing'
    }, async response => {
        // Extract our json response if request is successful
        if(response.ok) {
            const data = await response.json();

            // Send the response data through the bot
            res.channel.send(data.message);
        }
    }, {
        // Define any additional headers, if not set content-type will be set to application/json automatically
        'Content-Type': 'application/json'
    });
});
```

## License
[MIT](https://github.com/lntel/Quickcord/blob/master/LICENSE)
