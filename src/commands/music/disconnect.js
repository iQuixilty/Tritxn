const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "disconnect",
    category: "Music",
    aliases: ['dc'],
    cooldown: 5,
    description: "Makes the bot leave the voice channel",
    usage: "\`PREFIXleavevc\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message);

        const queue = client.queue.get(message.guild.id);

        queue.channel.leave();

        return message.channel.send(new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setDescription(`**I left the voice channel**`))
    }
};
