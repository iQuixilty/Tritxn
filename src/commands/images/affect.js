const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");
const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "affect",
    category: "Images",
    aliases: ['aff'],
    description: "Does it affect my baby",
    usage: "\`PREFIXaffect [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let user = message.mentions.users.first() || message.author;


        let userAvatar = user.displayAvatarURL({ format: 'png', dynamic: false })

        let face = await canvacord.Canvas.affect(userAvatar)
        let attachment = new MessageAttachment(face, "affect.png");
        return message.channel.send(attachment)
    }
}