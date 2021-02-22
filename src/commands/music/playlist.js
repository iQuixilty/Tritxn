const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const { play } = require("../includes/play");
const YouTubeAPI = require("simple-youtube-api");


let config;
try {
    config = require("../../../config/config.json");
} catch (error) {
    config = null;
}

const YOUTUBE_API_KEY = 'AIzaSyBB0VmRORHM5WEsWft8RgbGtHR9-OzEahQ'
const MAX_PLAYLIST_SIZE = config.MAX_PLAYLIST_SIZE;

const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "playlist",
    category: "Music",
    aliases: ["pl"],
    cooldown: 5,
    description: "Plays a playlist from youtube",
    usage: "\`PREFIXplaylist [Youtube Playlist URL | Playlist Name]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message);
        const playl = new Discord.MessageEmbed()
        const guildInfo = client.guildInfoCache.get(message.guild.id)

        const { channel } = message.member.voice;
        const serverQueue = message.client.queue.get(message.guild.id);

        if (!args.length)
            return message
                .reply(playl.setColor(message.guild.me.displayColor).setDescription(`**Usage: ${guildInfo.prefix}playlist [YouTube Playlist URL | Playlist Name]**`))
                .catch(console.error);
        if (!channel) return message.reply(playl.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, you need to join a voice channel first!**`)).catch(console.error);

        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT"))
            return message.reply(playl.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, cannot connect to voice channel, missing permissions**`));
        if (!permissions.has("SPEAK"))
            return message.reply(playl.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, I cannot speak in this voice channel, make sure I have the proper permissions!**`));

        if (serverQueue && channel !== message.guild.me.voice.channel)
            return message.reply(playl.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, you must be in the same channel as ${message.client.user}**`)).catch(console.error);

        const search = args.join(" ");
        const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
        const url = args[0];
        const urlValid = pattern.test(args[0]);

        const queueConstruct = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: 100,
            playing: true
        };

        let song = null;
        let playlist = null;
        let videos = [];

        if (urlValid) {
            try {
                playlist = await youtube.getPlaylist(url, { part: "snippet" });
                videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
            } catch (error) {
                console.error(error);
                return message.reply(playl.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, playlist not found**`)).catch(console.error);
            }
        } else {
            try {
                const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
                playlist = results[0];
                videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
            } catch (error) {
                console.error(error);
                return message.reply(error.message).catch(console.error);
            }
        }

        const newSongs = videos.map((video) => {
            return (song = {
                title: video.title,
                url: video.url,
                duration: video.durationSeconds
            });
        });

        serverQueue ? serverQueue.songs.push(...newSongs) : queueConstruct.songs.push(...newSongs);

        const songs = serverQueue ? serverQueue.songs : queueConstruct.songs;

        let playlistEmbed = new Discord.MessageEmbed()
            .setTitle(`${playlist.title}`)
            .setDescription(songs.map((song, index) => `${index + 1}. ${song.title}`))
            .setURL(playlist.url)
            .setColor(message.guild.me.displayColor)
            .setTimestamp();

        if (playlistEmbed.description.length >= 2048)
            playlistEmbed.description =
                playlistEmbed.description.substr(0, 2007) + "\nPlaylist larger than character limit...";

        message.channel.send(`**${message.author} Started a playlist**`, playlistEmbed);

        if (!serverQueue) {
            message.client.queue.set(message.guild.id, queueConstruct);

            try {
                queueConstruct.connection = await channel.join();
                await queueConstruct.connection.voice.setSelfDeaf(true);
                play(queueConstruct.songs[0], message);
            } catch (error) {
                console.error(error);
                message.client.queue.delete(message.guild.id);
                await channel.leave();
                return message.channel.send(playl.setColor(message.guild.me.displayColor).setDescription(`**Could not join the channel: ${error.message}**`)).catch(console.error);
            }
        }
    }
};
