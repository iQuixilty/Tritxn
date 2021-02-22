const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "america",
    category: "Images",
    aliases: ['amer', 'murica'],
    description: "Show your pride for america!",
    usage: "\`PREFIXamerica [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        
    
        let user = message.mentions.users.first() || message.author;
        let authorAvatar = user.displayAvatarURL({format: 'png', dynamic: true})

        let face = await canvacord.Canvas.fuse('https://media.giphy.com/media/3o7TKwhW6L2tpmFsqc/giphy.gif', user.displayAvatarURL({ format: "png", dynamic: false }))
        let attachment = new MessageAttachment(face, "america.gif");
        return message.channel.send(attachment)
    }
}