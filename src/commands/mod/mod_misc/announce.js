const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

module.exports = {
    name: "announce",
    category: "Moderation",
    description: "Annouce something to a server",
    perms: ['ADMINISTRATOR'],
    usage: "\`PREFIXannounce #channel [annoucement <-everyone || -here || nothing>]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const aEmbed = new Discord.MessageEmbed()


        let aChannel = message.mentions.channels.first()

        if (!aChannel) {
            return message.channel.send(aEmbed
                .setColor(message.guild.me.displayColor)
                .setTitle("Tell me where you want to annouce you idiot.."))
        }

        let announcement = args.slice(1).join(' ')

        if (!announcement) {
            return message.channel.send(aEmbed
                .setColor(message.guild.me.displayColor)
                .setTitle("Tell me what your announcing bruh"))
        }



        if (announcement.endsWith('-everyone')) {

            message.channel.send(aEmbed
                .setColor(message.guild.me.displayColor)
                .setTitle("Your message has been announced"))

            aChannel.send("@everyone")



            aChannel.send(aEmbed
                .setColor(message.guild.me.displayColor)
                .setTitle(`📢 Announcement in ${message.guild.name} 📢`)
                .setDescription(`${announcement.slice(announcement.length - 1)}`).setFooter(`This message was created by: ${message.author.tag}`)
                .setThumbnail(message.guild.iconURL()))

        } else if (announcement.endsWith('-here')) {

            message.channel.send(aEmbed
                .setColor(message.guild.me.displayColor)
                .setTitle("Your message has been announced"))

            aChannel.send("@here")

            aChannel.send(aEmbed
                .setColor(message.guild.me.displayColor)
                .setTitle(`📢 Announcement in ${message.guild.name} 📢`)
                .setDescription(`${announcement}`)
                .setFooter(`This message was created by: ${message.author.tag}`)
                .setThumbnail(message.guild.iconURL()))

        } else {
            message.channel.send(aEmbed
                .setColor(message.guild.me.displayColor)
                .setTitle("Your message has been announced"))

            aChannel.send(aEmbed
                .setColor(message.guild.me.displayColor)
                .setTitle(`📢 Announcement in ${message.guild.name} 📢`)
                .setDescription(`${announcement}`)
                .setFooter(`This message was created by: ${message.author.tag}`)
                .setThumbnail(message.guild.iconURL()))
        }
    }
}