const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
const { MessageEmbed, DiscordAPIError } = require("discord.js");

const YouTubeAPI = require("simple-youtube-api");
const { setCooldown } = require('../../utils/utils')


const youtubeAPI = 'AIzaSyBB0VmRORHM5WEsWft8RgbGtHR9-OzEahQ'
const youtube = new YouTubeAPI(youtubeAPI);

module.exports = {
    name: "searchyt",
    category: "Music",
    aliases: ["syt"],
    cooldown: 5,
    description: "Search and select videos to play",
    usage: "\`PREFIXsearchyt [Video Name]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],

    execute: async function (client, message, args) {

        setCooldown(client, this, message);
        const sea = new MessageEmbed()
        const guildInfo = client.guildInfoCache.get(message.guild.id)

        if (!message.channel.nsfw) {
            return message.channel.send(sea
                .setColor(message.guild.me.displayColor)
                .setDescription(`**Due to restrictions, you can only use this command in nsfw channels**`))
        }

        if (!args.length)
            return message
                .reply(sea.setColor(message.guild.me.displayColor).setDescription(`**Usage: ${guildInfo.prefix}${module.exports.name} [Video Name]**`))
                .catch(console.error);
        if (message.channel.activeCollector)
            return message.reply(sea.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, a message collector is already active in this channel.**`));
        if (!message.member.voice.channel)
            return message.reply(sea.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, you need to join a voice channel first!**`)).catch(console.error);

        const search = args.join(" ");

        let resultsEmbed = new MessageEmbed()
            .setTitle(`**Use the number to play the song**`)
            .setDescription(`Results for: ${search}`)
            .setColor(message.guild.me.displayColor);

        try {
            const results = await youtube.searchVideos(search, 10);
            results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`));

            let resultsMessage = await message.channel.send(resultsEmbed);

            function filter(msg) {
                const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g;
                return pattern.test(msg.content);
            }

            message.channel.activeCollector = true;
            const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] });
            const reply = response.first().content;

            if (reply.includes(",")) {
                let songs = reply.split(",").map((str) => str.trim());

                for (let song of songs) {
                    await message.client.commands
                        .get("play")
                        .execute(message, [resultsEmbed.fields[parseInt(song) - 1].name]);
                }
            } else {
                const choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;
                client.commands.get("play").execute(client, message, [choice]);
            }

            message.channel.activeCollector = false;
            resultsMessage.delete().catch(console.error);
            response.first().delete().catch(console.error);

        } catch (error) {
            console.error(error);
            message.channel.activeCollector = false;
            message.reply(error.message).catch(console.error);
        }
    }
};
