const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const { play } = require("../../utils/playutil");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const ms = require('ms')

const youtubeAPI = 'AIzaSyBB0VmRORHM5WEsWft8RgbGtHR9-OzEahQ'
const youtube = new YouTubeAPI(youtubeAPI);

const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "seek",
    category: "Music",
    aliases: ["fastforward"],
    cooldown: 5,
    description: "Skips to desired place in the currently playing song",
    usage: "\`PREFIXseek [amount]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT'],

    execute: async function (client, message, args) {
        const PLA = new Discord.MessageEmbed()

        setCooldown(client, this, message);

        const { channel } = message.member.voice;

        const serverQueue = client.queue.get(message.guild.id);
        
        if (!channel) return message.reply(PLA
            .setColor(message.guild.me.displayColor)
            .setDescription(`**${message.author} you need to join a voice channel first!**`)).catch((e) => console.log(e));

        if (!serverQueue || serverQueue.songs === []) return message.reply(PLA
            .setColor(message.guild.me.displayColor)
            .setDescription(`**${message.author} there is nothing playing.**`)).catch((e) => console.log(e));

        if (serverQueue && channel !== message.guild.me.voice.channel)
            return message.reply(PLA
                .setColor(message.guild.me.displayColor)
                .setDescription(`**${message.author} you must be in the same channel as ${message.client.user}**`)).catch((e) => console.log(e))

        const song = serverQueue.songs[0];

        let time = args[0]
        if (!time || isNaN(ms(time))) {
            return message.channel.send(PLA
                .setColor(message.guild.me.displayColor)
                .setDescription(`**Please specify a valid amount on how you want to skip by**`))
        }

        if (song.duration < ms(time) / 1000) {
            return message.channel.send(PLA
                .setColor(message.guild.me.displayColor)
                .setDescription(`**The song isnt that long!**`))
        }

        serverQueue.seekedTime = ms(time) / 1000

        try {
            play(serverQueue.songs[0], message, ms(time));
        } catch (error) {
            console.log(error);
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return message.channel.send(PLA.setColor(message.guild.me.displayColor).setDescription(`**Could not join the channel: ${error}**`)).catch((e) => console.log(e));
        }
    }
}
