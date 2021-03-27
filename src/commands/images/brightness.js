const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../utils/utils')
const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "brightness",
    category: "Images",
    aliases: ['brs'],
    description: "Changes the brightness of a profile picture",
    usage: "\`PREFIXbrightness [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let user = message.mentions.users.first() || message.author;


        let userAvatar = user.displayAvatarURL({ format: 'png', dynamic: false })
        let amount = args[0]

        if (!amount) {
            amount = 1
        }

        let face = await canvacord.Canvas.brightness(userAvatar, amount)
        let attachment = new MessageAttachment(face, "brightness.png");
        return message.channel.send(attachment)
    }
}