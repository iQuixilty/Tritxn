const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "shuffle",
    category: "Music",
    aliases: ["shuf"],
    cooldown: 5,
    description: "Shuffles the queue",
    usage: "\`PREFIXshuffle\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT', 'ADD_REACTIONS'],

    execute: async function (client, message, args) {
        const shf = new Discord.MessageEmbed()
        setCooldown(client, this, message);

        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send(shf.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, there is no queue.**`)).catch((e) => console.log(e));
        if (!canModifyQueue(message.member)) return;

        let songs = queue.songs;
        for (let i = songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        queue.songs = songs;
        message.client.queue.set(message.guild.id, queue);
        queue.textChannel.send(shf.setColor(message.guild.me.displayColor).setDescription(`**${message.author} 🔀 shuffled the queue**`)).catch((e) => console.log(e));
    }
};
