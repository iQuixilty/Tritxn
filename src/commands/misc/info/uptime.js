const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

module.exports = {
    name: "uptime",
    category: "Misc",
    description: "Displays the amount of time the bot has been online.",
    usage: "\`PREFIXuptime\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let seconds = Math.floor(message.client.uptime / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);

        seconds %= 60;
        minutes %= 60;
        hours %= 24;

        message
            .reply(`Uptime: \`${days} day(s),${hours} hours, ${minutes} minutes, ${seconds} seconds\``)
            .catch(console.error);
    }
}