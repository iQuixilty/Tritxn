const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor
const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "stop",
    category: "Music",
    cooldown: 5,
    description: "Stops the music player",
    usage: "\`PREFIXstop\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],

    execute: async function (client, message, args) {
        const stop = new Discord.MessageEmbed()

        setCooldown(client, this, message);
        
        const queue = message.client.queue.get(message.guild.id);

        if (!queue) return message.reply(stop.setColor(message.guild.me.displayColor).setDescription(`**${message.author} there is nothing playing.**`)).catch(console.error);
        if (!canModifyQueue(message.member)) return;

        queue.songs = [];
        queue.connection.dispatcher.end();
        queue.textChannel.send(stop.setColor(message.guild.me.displayColor).setDescription(`**${message.author} ⏹ stopped the music!**`)).catch(console.error);
    }
};