const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const { canModifyQueue } = require("../../utils/vcUtil");

const createBar = require("string-progressbar");

const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "nowplaying",
    category: "Music",
    aliases: ["np"],
    cooldown: 5,
    description: "Displays the current song that is playing",
    usage: "\`PREFIXnowplaying\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT'],

    execute: async function (client, message, args) {
        const nowp = new Discord.MessageEmbed()    
        setCooldown(client, this, message);

        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.reply(nowp.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, there is nothing playing.**`)).catch((e) => console.log(e));

        const song = queue.songs[0];
        const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000 + queue.seekedTime
        const left = song.duration - seek + queue.seekedTime

        let nowPlaying = new Discord.MessageEmbed()
            .setTitle("Now playing")
            .setDescription(`[${song.title}](${song.url})`)
            .setColor(message.guild.me.displayColor)
            .setAuthor(message.client.user.username);

        if (song.duration > 0) {
            nowPlaying.addField(
                "\u200b",
                new Date(seek * 1000).toISOString().substr(11, 8) +
                " [" +
                createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
                "] " +
                (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
                false
            );
            nowPlaying.setFooter("Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8));
        }

        return message.channel.send(nowPlaying);
    }
};
