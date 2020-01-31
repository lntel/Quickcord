const discord = require('discord.js');
const package = require('../package.json');

module.exports = props => {
    const embed = new discord.RichEmbed(props);

    const footer = embed.footer || `- Made with Quickcord v${package.version}`;

    embed.setFooter(footer);

    return embed;
}