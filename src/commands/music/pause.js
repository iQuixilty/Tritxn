const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor
const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "pause",
    category: "Music",
    description: "Pauses the music player",
    usage: "\`PREFIXpause\`",
    cooldown: 5,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],

    execute: async function (client, message, args) {
        const pa = new Discord.MessageEmbed()

        setCooldown(client, this, message);
        
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.reply(pa.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, there is nothing playing.**`)).catch(console.error);
        if (!canModifyQueue(message.member)) return;

        if (queue.playing) {
            queue.playing = false;
            queue.connection.dispatcher.pause(true);
            return queue.textChannel.send(pa.setColor(message.guild.me.displayColor).setDescription(`**${message.author} ⏸ paused the music.**`)).catch(console.error);
        }
    }
};
