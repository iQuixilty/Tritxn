const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor


module.exports = {
    name: "youtube",
    category: "Misc",
    aliases: ["yt"],
    description: "Sends a link to my youtube channel(s)",
    usage: "\`PREFIXyoutube\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const youtube = new Discord.MessageEmbed()
            .setTitle('Links To My Channels:')
            .setDescription('`Subscribe if you want!` \n\n[Main Youtube Channel](https://www.youtube.com/channel/UCGGkfviead-IgJeyNNTQryg) \n\n[Rocket League Team](https://www.youtube.com/channel/UCbg1vu2_J_Dlit3qF9MUaiQ)')
            .setThumbnail("https://i.imgur.com/TCJV3Bd.png")
            .setColor(message.guild.me.displayColor)
            .setFooter(`Trtixn Bot`, message.author.avatarURL())
            .setTimestamp()
        message.channel.send(youtube);
    }
}