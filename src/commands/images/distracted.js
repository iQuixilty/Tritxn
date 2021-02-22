const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "distracted",
    category: "Images",
    aliases: ['dis'],
    description: "You are distracted by someone",
    usage: "\`PREFIXdistracted [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {

        let user = message.author;
        let userAvatar = user.displayAvatarURL({ format: 'png', dynamic: false })

        let user2 = message.mentions.users.first()
     
        const dise = new Discord.MessageEmbed()
        if (!user2) return message.channel.send(dise.setColor(message.guild.me.displayColor).setTitle('Who are you distracted by'))

        let user2Avatar = user2.displayAvatarURL({ format: 'png', dynamic: false })

        let image = await canvacord.Canvas.distracted(user2Avatar, userAvatar)
        let attachment = new MessageAttachment(image, "distracted.png");

        return message.channel.send(attachment)
    }
}