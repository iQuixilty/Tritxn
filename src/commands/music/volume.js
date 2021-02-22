const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "volume",
    category: "Music",
    aliases: ["v"],
    cooldown: 5,
    description: "Changes the volume of the music",
    usage: "\`PREFIXvolume\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],

    execute: async function (client, message, args) {
        const queue = message.client.queue.get(message.guild.id);
        const vol = new Discord.MessageEmbed()
        
        setCooldown(client, this, message);

        if (!queue) return message.reply(vol.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, there is nothing playing.**`)).catch(console.error);

        if (!canModifyQueue(message.member))
            return message.reply(vol.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, you need to join a voice channel first!**`)).catch(console.error);

        if (!args[0]) return message.reply(vol.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, 🔊 the current volume is: ${queue.volume}%**`)).catch(console.error);

        if (isNaN(args[0])) return message.reply(vol.setColor(message.guild.me.displayColor).setDescription(`**${message.author},"Please use a number to set volume.**`)).catch(console.error);

        if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
            return message.reply(vol.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please use a number between 0 - 100.**`)).catch(console.error);

        queue.volume = args[0];
        queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

        return queue.textChannel.send(vol.setColor(message.guild.me.displayColor).setDescription(`**Volume set to: ${args[0]}%**`)).catch(console.error);
    }
};