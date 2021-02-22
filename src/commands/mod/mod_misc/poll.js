const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const emoji = require('../../../../config/emoji.json')

module.exports = {
    name: "poll",
    category: "Moderation",
    description: "Generates a poll and sends to the specified channel",
    usage: "\`PREFIXpoll <#channel> [poll description]\`",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {

        let pollChannel = message.mentions.channels.first();
        let pollDescription = args.slice(1).join(' ');

        if (!pollChannel) {
            pollChannel = message.channel
            pollDescription = args.join(' ');
        }

        if (pollChannel.length > 1024) {
            return message.channel.send(new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor())
            .setDescription(`**Your poll is too long**`))
        }

        let embedPoll = new Discord.MessageEmbed()
            .setTitle(`${message.author.username} asks`)
            .setThumbnail(`https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/185/bar-chart_1f4ca.png`)
            .setDescription(pollDescription)
            .setColor(message.guild.me.displayColor)

        let msgEmbed = await pollChannel.send(embedPoll)
        await msgEmbed.react('👍')
        await msgEmbed.react('👎')
        await msgEmbed.react('🤷‍♂️')
    }
}