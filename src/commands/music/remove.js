const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor
const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "remove",
    category: "Music",
    aliases: ["rm"],
    cooldown: 5,
    description: "Remove a song from the queue",
    usage: "\`PREFIXremove [Queue Number]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT', 'ADD_REACTIONS'],

    execute: async function (client, message, args) {
        
        setCooldown(client, this, message);
        const reme = new Discord.MessageEmbed()
        const guildInfo = client.guildInfoCache.get(message.guild.id)

        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send(reme.setColor(message.guild.me.displayColor).setTitle("There is no queue.")).catch((e) => console.log(e));
        if (!canModifyQueue(message.member)) return;

        if (!args.length || isNaN(args[0])) return message.reply(reme.setColor(message.guild.me.displayColor).setDescription(`**Usage: ${guildInfo.prefix}remove [Queue Number]**`));

        const song = queue.songs.splice(args[0] - 1, 1);
        queue.textChannel.send(reme.setColor(message.guild.me.displayColor).setDescription(`${message.author} ❌ removed **${song[0].title}** from the queue.`));
    }
};
