
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const lyricsFinder = require("lyrics-finder");
const { canModifyQueue } = require("../../utils/vcUtil");
const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "lyrics",
    category: "Music",
    aliases: ["ly"],
    cooldown: 5,
    description: "Fetches the lyrics of a song",
    usage: "\`PREFIXlyrics\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT',],

    execute: async function (client, message, args) {
        const lyr = new Discord.MessageEmbed()
        
        setCooldown(client, this, message);

        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send(lyr.setColor(message.guild.me.displayColor).setDescription("**❌ There is nothing playing.**")).catch((e) => console.log(e));

        let lyrics = null;

        try {
            lyrics = await lyricsFinder(queue.songs[0].title, "");
            if (!lyrics) lyrics = `No lyrics found for ${queue.songs[0].title}.`;
        } catch (error) {
            lyrics = `No lyrics found for ${queue.songs[0].title}.`;
        }

        let lyricsEmbed = new Discord.MessageEmbed()
            .setTitle(`${queue.songs[0].title} — Lyrics`)
            .setDescription(lyrics)
            .setColor(message.guild.me.displayColor)
            .setTimestamp();

        if (lyricsEmbed.description.length >= 2048)
            lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
        return message.channel.send(lyricsEmbed).catch((e) => console.log(e));
    }
};
