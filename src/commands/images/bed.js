const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "bed",
    category: "Images",
    description: "A scary monster is under your bed!",
    usage: "\`PREFIXbed [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let user1 = message.mentions.users.first()
        const bede = new Discord.MessageEmbed()

        if (!user1) return message.reply(bede.setColor(message.guild.me.displayColor).setTitle(`${message.author.username} provide a valid user`))

        let user2 = message.author

        let avatar1 = user1.displayAvatarURL({format: 'png', dynamic: false})
        let avatar2 = user2.displayAvatarURL({format: 'png', dynamic: false})

        let face = await canvacord.Canvas.bed(avatar2, avatar1)
        let attachment = new MessageAttachment(face, "bed.png");
        return message.channel.send(attachment)
    }
}