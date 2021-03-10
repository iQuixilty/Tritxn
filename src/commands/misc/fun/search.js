const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor


const YouTube = require('simple-youtube-api')
const youtubeAPI = 'AIzaSyBB0VmRORHM5WEsWft8RgbGtHR9-OzEahQ'
const youtube = new YouTube(youtubeAPI)

const ytdl = require('ytdl-core');

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "search",
    category: "Misc",
    description: "Searchs for a video on youtube",
    usage: "\`PREFIXsearch [query]\`",
    nsfwOnly: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const query = args.join(" ")
        const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : ''

        const yt2 = new Discord.MessageEmbed()

        if (!query) {
            return message.channel.send(yt2
                .setColor('RED')
                .setDescription("**Please provide a search query**"))
        }


        try {
            video = await ytdl.getInfo(url);
        } catch {
            try {
                const videos = await youtube.searchVideos(query, 1);
                var video = await ytdl.getInfo(videos[0].url);
            } catch {
                return message.channel.send(yt2
                    .setColor('RED')
                    .setTitle("I couldnt find any search results"))
            }
        }


        const ytembed = new Discord.MessageEmbed()
            .setTitle(video.videoDetails.title)
            .setThumbnail(video.videoDetails.thumbnails[0].url)
            .setColor('RED')
            .setDescription(`**[Click here to watch the video!](${video.videoDetails.video_url})**`)
            .setAuthor(video.videoDetails.author.name,)
            .addField("Views", video.videoDetails.viewCount, true)
            .addField("Duration", `${parseInt(video.videoDetails.lengthSeconds / 60)}:${video.videoDetails.lengthSeconds - 60 * parseInt(video.videoDetails.lengthSeconds / 60)}`, true)
            .addField("Category", video.videoDetails.category, true)
            .addField("👍 - Likes", video.videoDetails.likes, true)
            .addField("👎 - Dislikes", video.videoDetails.dislikes, true)

        return message.channel.send(ytembed)
    }
}