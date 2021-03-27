const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "clearqueue",
    category: "Music",
    aliases: ["clearq", 'cq'],
    cooldown: 5,
    description: "Clear the current music queue",
    usage: "\`PREFIXclearqueue\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT', 'ADD_REACTIONS'],

    execute: async function (client, message, args) {
        const PLA = new Discord.MessageEmbed()

        setCooldown(client, this, message);

        const { channel } = message.member.voice;

        const serverQueue = message.client.queue.get(message.guild.id);
        if (!channel) return message.reply(PLA.setColor(message.guild.me.displayColor).setDescription(`**${message.author} you need to join a voice channel first!**`)).catch((e) => console.log(e));

        if (!serverQueue) return message.reply(PLA.setColor(message.guild.me.displayColor).setDescription(`**${message.author} there is nothing playing.**`)).catch((e) => console.log(e));

        if (serverQueue && channel !== message.guild.me.voice.channel)
            return message.reply(PLA.setColor(message.guild.me.displayColor).setDescription(`**${message.author} you must be in the same channel as ${message.client.user}**`)).catch((e) => console.log(e));

        if (serverQueue.songs.length === 0) {
            return message.reply(PLA.setColor(message.guild.me.displayColor).setDescription(`**${message.author} the queue is empty**`)).catch((e) => console.log(e));
        }

        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();

        serverQueue.textChannel
            .send(PLA.setColor(message.guild.me.displayColor).setDescription(`**✅ The queue has been cleared**`))
            .catch((e) => console.log(e));
    }
}
