const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../utils/utils')
const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "beautify",
    category: "Images",
    aliases: ['beautiful', 'beau'],
    description: "Beautifies someone",
    usage: "\`PREFIXbeautify [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let user = message.mentions.users.first() || message.author;


        let userAvatar = user.displayAvatarURL({ format: 'png', dynamic: false })

        let face = await canvacord.Canvas.beautiful(userAvatar)
        let attachment = new MessageAttachment(face, "beautiful.png");
        return message.channel.send(attachment)
    }
}