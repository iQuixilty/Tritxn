const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const { play } = require("../../utils/playutil");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");

const youtubeAPI = 'AIzaSyBB0VmRORHM5WEsWft8RgbGtHR9-OzEahQ'
const youtube = new YouTubeAPI(youtubeAPI);

const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "play",
    category: "Music",
    aliases: ["p"],
    cooldown: 5,
    description: "Plays audio from youtube",
    usage: "\`PREFIXplay [Youtube Link URL | Video Name]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT', 'ADD_REACTIONS'],

    execute: async function (client, message, args) {
        const PLA = new Discord.MessageEmbed()

        setCooldown(client, this, message);

        const { channel } = message.member.voice;

        const serverQueue = client.queue.get(message.guild.id);
        if (!channel) return message.reply(PLA.setColor(message.guild.me.displayColor).setDescription(`**${message.author} you need to join a voice channel first!**`)).catch((e) => console.log(e));
        if (serverQueue && channel !== message.guild.me.voice.channel)
            return message.reply(PLA.setColor(message.guild.me.displayColor).setDescription(`**${message.author} you must be in the same channel as ${message.client.user}**`)).catch((e) => console.log(e));

        const guildInfo = client.guildInfoCache.get(message.guild.id)

        if (!args.length)
            return message
                .reply(PLA.setColor(message.guild.me.displayColor).setDescription(`**Usage: ${guildInfo.prefix}play [YouTube URL | Video Name ]**`))
                .catch((e) => console.log(e));

        const search = args.join(" ");
        const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;

        const url = args[0];
        const urlValid = videoPattern.test(args[0]);

        // Start the playlist if playlist url was provided
        if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
            return client.commands.get('playlist').execute(client, message, args)
        }

        const queueConstruct = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: 95,
            playing: true,
            requester: message.author.id,
            seekedTime: 0,
        };

        let songInfo = null;
        let song = null;

        if (urlValid) {
            try {
                songInfo = await ytdl.getInfo(url);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds
                };
            } catch (e) {
                console.log(e);
                return message.reply(error.message).catch((e) => console.log(e));
            }
        } else {
            try {
                const results = await youtube.searchVideos(search, 1);
                songInfo = await ytdl.getInfo(results[0].url);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds
                };
            } catch (error) {
                console.log(error)
                return message.reply(error.message).catch((e) => console.log(e));
            }
        }

        if (serverQueue) {
            if (serverQueue.songs === []) {
                serverQueue.songs.push(song);
                return serverQueue.textChannel
                    .send(PLA.setColor(message.guild.me.displayColor).setDescription(`✅ **${song.title}** has been added to the queue by ${message.author}`))
                    .catch((e) => console.log(e));
            }

            serverQueue.songs.push(song);
            return serverQueue.textChannel
                .send(PLA.setColor(message.guild.me.displayColor).setDescription(`✅ **${song.title}** has been added to the queue by ${message.author}`))
                .catch((e) => console.log(e));
        }

        queueConstruct.songs.push(song);
        message.client.queue.set(message.guild.id, queueConstruct);

        try {
            queueConstruct.connection = await channel.join();
            await queueConstruct.connection.voice.setSelfDeaf(true);
            play(queueConstruct.songs[0], message);
        } catch (error) {
            console.log(error);
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return message.channel.send(PLA.setColor(message.guild.me.displayColor).setDescription(`**Could not join the channel: ${error}**`)).catch((e) => console.log(e));
        }
    }
}
