# Quickcord
Quickcord is a Discord.js wrapper which integrates express frameworks simplicity to enable you to quickly and easily set up a Discord bot with minimal effort.

[![npm version](https://badge.fury.io/js/quickcord.svg)](https://badge.fury.io/js/quickcord)
[![GitHub version](https://badge.fury.io/gh/lntel%2Fquickcord.svg)](https://badge.fury.io/gh/lntel%2Fquickcord)

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

const client = new Quickcord.Client('discordBotToken', ['!', '.']);
```

When instantiating the Quickcord client, there are two parameters which you must provide, the first being the Discord bot token and the second being either a string containing you bot prefix or an array containing multiple prefixes.