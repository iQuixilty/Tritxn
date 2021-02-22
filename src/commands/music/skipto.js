const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "skipto",
    category: "Music",
    aliases: ["st"],
    cooldown: 5,
    description: "Skip to the selected queue number",
    usage: "\`PREFIXskipto [Queue Number]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],

    execute: async function (client, message, args) {
        const spo = new Discord.MessageEmbed()
        const guildInfo = client.guildInfoCache.get(message.guild.id)

        setCooldown(client, this, message);

        if (!args.length || isNaN(args[0]))
            return message
                .reply(spo.setColor(message.guild.me.displayColor).setDescription(`**Usage: ${guildInfo.prefix}${module.exports.name} [Queue Number]**`))
                .catch(console.error);

        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send(spo.setColor(message.guild.me.displayColor).setTitle("There is no queue.")).catch(console.error);
        if (!canModifyQueue(message.member)) return;
        if (args[0] > queue.songs.length)
            return message.reply(spo.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, the queue is only ${queue.songs.length} songs long!**`)).catch(console.error);

        queue.playing = true;

        if (queue.loop) {
            for (let i = 0; i < args[0] - 2; i++) {
                queue.songs.push(queue.songs.shift());
            }
        } else {
            queue.songs = queue.songs.slice(args[0] - 2);
        }

        queue.connection.dispatcher.end();
        queue.textChannel.send(spo.setColor(message.guild.me.displayColor).setDescription(`**${message.author} ⏭ skipped ${args[0] - 1} songs**`)).catch(console.error);
    }
};