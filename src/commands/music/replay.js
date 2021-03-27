const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const { play } = require("../../utils/playutil");
const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "replay",
    category: "Music",
    aliases: ["rep"],
    cooldown: 5,
    description: "Replays the currently playing song",
    usage: "\`PREFIXreplay\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT', 'ADD_REACTIONS'],

    execute: async function (client, message, args) {
        const PLA = new Discord.MessageEmbed()

        setCooldown(client, this, message);

        const { channel } = message.member.voice;

        const serverQueue = client.queue.get(message.guild.id);
        if (!channel) return message.reply(PLA.setColor(message.guild.me.displayColor).setDescription(`**${message.author} you need to join a voice channel first!**`)).catch((e) => console.log(e));

        if (!serverQueue) return message.reply(PLA.setColor(message.guild.me.displayColor).setDescription(`**${message.author} there is nothing playing.**`)).catch((e) => console.log(e));

        if (serverQueue && channel !== message.guild.me.voice.channel)
            return message.reply(PLA.setColor(message.guild.me.displayColor).setDescription(`**${message.author} you must be in the same channel as ${message.client.user}**`)).catch((e) => console.log(e));

        try {
            play(serverQueue.songs[0], message);
        } catch (error) {
            console.log(error);
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return message.channel.send(PLA.setColor(message.guild.me.displayColor).setDescription(`**Could not join the channel: ${error}**`)).catch((e) => console.log(e));
        }
    }
}
