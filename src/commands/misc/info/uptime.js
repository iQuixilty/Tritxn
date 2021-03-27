const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "uptime",
    category: "Misc",
    description: "Displays the amount of time the bot has been online.",
    usage: "\`PREFIXuptime\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let seconds = Math.floor(message.client.uptime / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);

        seconds %= 60;
        minutes %= 60;
        hours %= 24;

        message
            .channel.send(new Discord.MessageEmbed().setColor(message.guild.me.displayColor).setDescription(`**Uptime: \`${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours > 1 ? 's' : ''}, ${minutes} minute${minutes > 1 ? 's' : ''}, ${seconds} second${seconds > 1 ? 's' : ''}\`**`))
            .catch(console.error);
    }
}