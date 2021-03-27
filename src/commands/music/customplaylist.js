const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const config = require('../../../config/config.json')
const { paginate, msToTime, errorMessage } = require('../../utils/utils')
const { play } = require("../../utils/playutil");
const move = require('array-move')
const userSchema = require('../../../schemas/userSchema')
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
let x = '```'


const youtubeAPI = 'AIzaSyBB0VmRORHM5WEsWft8RgbGtHR9-OzEahQ'
const youtube = new YouTubeAPI(youtubeAPI);


/** 
 * @type {import('../../typings.d').Command}
*/

module.exports = {
    name: "customplaylist",
    category: "Music",
    aliases: ['cpl'],
    description: "Allows you to modify and create custom playlists",
    usage: "\`PREFIXcustomplaylist [flags] [option] <option>\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const embed = new Discord.MessageEmbed()

        let flags = args[0]
        let userId = message.author.id

        //Fetch Data

        let data = await userSchema.findByIdAndUpdate(userId, {}, { new: true, upsert: true, setDefaultsOnInsert: true })
        let plData = data.playlists
        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let prefix = guildInfo.prefix
        let reply = ``
        let embeds = []

        //

        // Display Playlits

        if (!flags) {
            if (!data || plData.length === 0) {
                return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**You have \`0\` active playlists**`))
            }

            for (let i = 0; i < plData.length; i++) {
                const EMBED = new Discord.MessageEmbed()
                    .setColor(message.guild.me.displayColor)
                    .setAuthor(`Playlist: ${plData[i].nameOfPlaylist}`, message.author.displayAvatarURL({ dynamic: true }))
                let songs = plData[i].songs
                let total = 0

                for (let j = 0; j < songs.length; j++) {
                    let ll = ''
                    songs[j].title.length > 25 ? ll = '...' : ''
                    reply += `**${j + 1}.** [${songs[j].title.substr(0, 25)}${ll}](${songs[j].url}) **|** ${msToTime(songs[j].duration * 1000)}\n\n`
                    total += parseInt(songs[j].duration)
                }

                EMBED.setDescription(reply === `` ? `You Have No Songs In This Playlist` : reply)
                EMBED.setFooter(`Total Queue Length: ${msToTime(total * 1000)}`)
                reply = ``

                embeds.push(EMBED)
            }

            if (embeds.length === 1) {
                return message.channel.send(embeds[0])
            } else {
                return paginate(message, embeds)
            }
        }

        //

        //Create A Playlist

        if (flags.toLowerCase() === '-create' || flags.toLowerCase() === '-cr') {
            let nameOfPlaylist = args[1]
            if (!nameOfPlaylist) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription('**Provide the name to your playlist**'))

            let name = {
                nameOfPlaylist,
                songs: []
            }
            await userSchema.findByIdAndUpdate(userId, { $push: { playlists: name } }, { new: true, upsert: true, setDefaultsOnInsert: true })

            return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Added new playlist with name:** \`${nameOfPlaylist}\``))
        } else if (flags.toLowerCase() === '-add') { //Add A Song To A Playlist
            let nameOfPlaylist = args[1]
            let options = []
            let res, val;

            for (let i = 0; i < plData.length; i++) {
                options.push(plData[i].nameOfPlaylist)
                if (nameOfPlaylist && plData[i].nameOfPlaylist.toLowerCase() === nameOfPlaylist.toLowerCase()) {
                    res = true
                    val = plData[i]
                }
            }

            if (options.length === 0) {
                return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**You have no playlists**`))
            }

            if (!nameOfPlaylist) {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setAuthor(`What playlist are you adding a song too?`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(x + `${`Playlists: ${options.join(', ')}`}` + x))
            }

            if (!res) {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**That playlist does not exist, check if you spelled it correctly**`))
            }

            const search = args.slice(2).join(" ");
            if (!search) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**What song do you want to add?**`))

            const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;

            const url = args[1];
            const urlValid = videoPattern.test(args[1]);

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
                } catch (error) {
                    return errorMessage(client, message, error)
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
                    return errorMessage(client, message, error)
                }
            }

            if (val.songs.length !== 0) {
                for (let k = 0; k < val.songs.length; k++) {
                    if (val.songs[k].url === song.url) {
                        return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**This song already exists in the playlist**`))
                    } else {
                        continue
                    }
                }
            }
            val.songs.push(song)

            await userSchema.findByIdAndUpdate(userId, { $set: { playlists: plData } }, { new: true, upsert: true, setDefaultsOnInsert: true })

            message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setAuthor(`Successfully Added Song`)
                .setDescription(song.title.length > 20 ? `[${song.title.substr(0, 20)}...](${song.url})` : `[${song.title}](${song.url})`))
        } else if (flags.toLowerCase() === '-delete' || flags.toLowerCase() === '-del') { //Delete a playlist
            let nameOfPlaylist = args[1]
            let val, res;
            if (!nameOfPlaylist) {
                return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**What playlist would you like to delete?**`))
            }

            for (let i = 0; i < plData.length; i++) {
                if (plData[i].nameOfPlaylist.toLowerCase() === nameOfPlaylist.toLowerCase()) {
                    res = true
                    val = plData[i]
                }
            }

            if (!res) {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**That playlist does not exist, check if you spelled it correctly**`))
            }


            await userSchema.findByIdAndUpdate(userId, { $pull: { playlists: val } }, { new: true, upsert: true, setDefaultsOnInsert: true })

            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Deleted the playlist: \`${nameOfPlaylist}\`**`))

        } else if (flags.toLowerCase() === '-remove' || flags.toLowerCase() === '-rm') { //Remove a song from a playlist
            let nameOfPlaylist = args[1]
            let options = []
            let res, val;

            for (let i = 0; i < plData.length; i++) {
                options.push(plData[i].nameOfPlaylist)
                if (nameOfPlaylist && plData[i].nameOfPlaylist.toLowerCase() === nameOfPlaylist.toLowerCase()) {
                    res = true
                    val = plData[i]
                }
            }

            if (options.length === 0) {
                return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**You have no playlists**`))
            }

            if (!nameOfPlaylist) {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setAuthor(`What playlist are you removing a song from?`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(x + `${`Playlists: ${options.join(', ')}`}` + x))
            }

            if (!res) {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**That playlist does not exist, check if you spelled it correctly**`))
            }

            let index = args[2]
            if (!index || isNaN(index) || parseInt(index) > val.songs.length || parseInt(index) < 1) {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**Provide a valid song to remove, use the number in front of the song to remove it**`))
            }

            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Removed the song [${val.songs[index - 1].title}](${val.songs[index - 1].url}) from the playlist \`${nameOfPlaylist}\`**`))


            val.songs.splice(index - 1, 1)
            await userSchema.findByIdAndUpdate(userId, { $set: { playlists: plData } }, { new: true, upsert: true, setDefaultsOnInsert: true })
        } else if (flags.toLowerCase() === '-rename' || flags.toLowerCase() === '-rnm') { //Renames a playlist
            let nameOfPlaylist = args[1]
            let nameOfNewPlaylist = args[2]
            let options = []
            let res, val;

            for (let i = 0; i < plData.length; i++) {
                options.push(plData[i].nameOfPlaylist)
                if (nameOfPlaylist && plData[i].nameOfPlaylist.toLowerCase() === nameOfPlaylist.toLowerCase()) {
                    res = true
                    val = plData[i]
                }
            }

            if (options.length === 0) {
                return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**You have no playlists**`))
            }

            if (!nameOfPlaylist) {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setAuthor(`What playlist are you renaming?`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(x + `${`Playlists: ${options.join(', ')}`}` + x))
            }

            if (!nameOfNewPlaylist) {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setAuthor(`What is the name of the new playlist?`, message.author.displayAvatarURL({ dynamic: true })))
            }

            if (!res) {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**That playlist does not exist, check if you spelled it correctly**`))
            }

            val.nameOfPlaylist = nameOfNewPlaylist

            await userSchema.findByIdAndUpdate(userId, { $set: { playlists: plData } }, { new: true, upsert: true, setDefaultsOnInsert: true })

            return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Successfully renamed the playlist \`${nameOfPlaylist}\` to \`${nameOfNewPlaylist}\`**`))

        } else if (flags.toLowerCase() === '-clear' || flags.toLowerCase() === '-cl') { //Clear the songs in a playlist
            let nameOfPlaylist = args[1]
            let options = []
            let res, val;

            for (let i = 0; i < plData.length; i++) {
                options.push(plData[i].nameOfPlaylist)
                if (nameOfPlaylist && plData[i].nameOfPlaylist.toLowerCase() === nameOfPlaylist.toLowerCase()) {
                    res = true
                    val = plData[i]
                }
            }

            if (options.length === 0) {
                return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**You have no playlists**`))
            }

            if (!nameOfPlaylist) {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setAuthor(`What playlist are you clearing the songs from?`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(x + `${`Playlists: ${options.join(', ')}`}` + x))
            }

            if (!res) {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**That playlist does not exist, check if you spelled it correctly**`))
            }

            val.songs = []
            await userSchema.findByIdAndUpdate(userId, { $set: { playlists: plData } }, { new: true, upsert: true, setDefaultsOnInsert: true })

            return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Successfully cleared all the songs in the playlist \`${nameOfPlaylist}\`**`))


        } else if (flags.toLowerCase() === '-move' || flags.toLowerCase() === '-mv') { //Move a song in a playlist to another location
            let nameOfPlaylist = args[1]
            let options = []
            let res, val;

            for (let i = 0; i < plData.length; i++) {
                options.push(plData[i].nameOfPlaylist)
                if (nameOfPlaylist && plData[i].nameOfPlaylist.toLowerCase() === nameOfPlaylist.toLowerCase()) {
                    res = true
                    val = plData[i]
                }
            }

            if (options.length === 0) {
                return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**You have no playlists**`))
            }

            if (!nameOfPlaylist) {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setAuthor(`What playlist are you removing a song from?`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(x + `${`Playlists: ${options.join(', ')}`}` + x))
            }

            if (!res) {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**That playlist does not exist, check if you spelled it correctly**`))
            }

            if (isNaN(args[2]) || args[2] < 1 || parseInt(args[2]) >= val.songs.length + 1) {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setDescription("**Provide a valid song to move**"))
                    .catch((e) => console.log(e));
            }

            if (isNaN(args[3]) || args[3] < 1 || parseInt(args[3]) >= val.songs.length + 1) {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setDescription("**Provide a valid location to move the song too**"))
                    .catch((e) => console.log(e));
            }
            let song = val.songs[args[2] - 1];

            val.songs = move(val.songs, args[2] - 1, args[3] == 1 ? 0 : args[3] - 1);

            message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setDescription(`**Moved [${song.title}](${song.url})**`))

            await userSchema.findByIdAndUpdate(userId, { $set: { playlists: plData } }, { new: true, upsert: true, setDefaultsOnInsert: true })
        } else if (flags.toLowerCase() === '-play' || flags.toLowerCase() === '-p') { //Play a playlist
            let nameOfPlaylist = args[1]
            let options = []
            let res, val;

            for (let i = 0; i < plData.length; i++) {
                options.push(plData[i].nameOfPlaylist)
                if (nameOfPlaylist && plData[i].nameOfPlaylist.toLowerCase() === nameOfPlaylist.toLowerCase()) {
                    res = true
                    val = plData[i]
                }
            }

            if (options.length === 0) {
                return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**You have no playlists**`))
            }

            if (!nameOfPlaylist) {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setAuthor(`What playlist are you removing a song from?`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(x + `${`Playlists: ${options.join(', ')}`}` + x))
            }

            if (!res) {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**That playlist does not exist, check if you spelled it correctly**`))
            }

            const { channel } = message.member.voice;
            const serverQueue = client.queue.get(message.guild.id);
            if (!channel) return message.reply(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author} you need to join a voice channel first!**`)).catch((e) => console.log(e));

            if (serverQueue && channel !== message.guild.me.voice.channel)
                return message.reply(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author} you must be in the same channel as ${message.client.user}**`)).catch((e) => console.log(e));


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

            for (let l = 0; l < val.songs.length; l++) {
                queueConstruct.songs.push(val.songs[l]);
            }
            client.queue.set(message.guild.id, queueConstruct);

            try {
                queueConstruct.connection = await channel.join();
                await queueConstruct.connection.voice.setSelfDeaf(true);
                play(queueConstruct.songs[0], message);
            } catch (e) {
                console.log(e)
                message.client.queue.delete(message.guild.id);
                await channel.leave();
                return message.channel.send(PLA.setColor(message.guild.me.displayColor).setDescription(`**Could not join the channel: ${error}**`)).catch((e) => console.log(e));
            }
        } else {
            const mainEmbed = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setAuthor(`Custom Playlists`, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`With this command, you can modify and save playlists to your discord account for easy access to songs.`)
                .addFields({
                    name: 'Creating A Playlist',
                    value: x + `${prefix}cpl -create [Playlist Name]` + x,
                }, {
                    name: `Deleting A Playlist`,
                    value: x + `${prefix}cpl -delete [Playlist Name]` + x,
                }, {
                    name: `Renaming A Playlist`,
                    value: x + `${prefix}cpl -rename [Playlist Name] [New Playlist Name]` + x,
                }, {
                    name: `Adding A Song`,
                    value: x + `${prefix}cpl -add [Playlist Name] [Song Name | Youtube Link]` + x,
                }, {
                    name: `Removing A Song`,
                    value: x + `${prefix}cpl -remove [Playlist Name] [Song Name | Youtube Link]` + x,
                }, {
                    name: `Moving Songs`,
                    value: x + `${prefix}cpl -move [Playlist Name] [Intial Location] [New Location]` + x,
                }, {
                    name: `Clearing Songs`,
                    value: x + `${prefix}cpl -clear [Playlist Name]` + x,
                }, {
                    name: `Playing A Playlist`,
                    value: x + `${prefix}cpl -play [Playlist Name]` + x,
                })

            message.channel.send(mainEmbed)
        }
    }
}