const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../utils/utils')
const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "deletetrash",
    category: "Images",
    aliases: ['del', 'delt'],   
    description: "Deletes some trash from your computer",
    usage: "\`PREFIXdeletetrash [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let user = message.mentions.users.first() || message.author;
        let userAvatar = user.displayAvatarURL({format: 'png', dynamic: false})
        

        let face = await canvacord.Canvas.delete(userAvatar, true)
        let attachment = new MessageAttachment(face, "delete.png");
        return message.channel.send(attachment)
    }
}