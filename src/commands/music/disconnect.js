const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const { setCooldown } = require('../../utils/utils')

/** 
* @type {import('../../typings.d').Command}
*/

module.exports = {
    name: "disconnect",
    category: "Music",
    aliases: ['dc'],
    cooldown: 5,
    description: "Makes the bot leave the voice channel",
    usage: "\`PREFIXleavevc\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT'],

    execute: async function (client, message, args) {
        const embed = new Discord.MessageEmbed()
        setCooldown(client, this, message);

        const queue = client.queue.get(message.guild.id);
        if (!queue) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**❌ Nothing playing in this server**`))

        if (!canModifyQueue(message.member)) return;

        queue.channel.leave();
        client.queue.delete(message.guild.id)

        return message.channel.send(new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setDescription(`**${message.author} ✅ I left the voice channel**`))
    }
};
