const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "blur",
    category: "Images",
    description: "Blurs your profile picture",
    usage: "\`PREFIXblur [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
    
        let user = message.mentions.users.first() || message.author;
      
   
        let userAvatar = user.displayAvatarURL({format: 'png', dynamic: false})

        let face = await canvacord.Canvas.blur(userAvatar)
        let attachment = new MessageAttachment(face, "blur.png");
        return message.channel.send(attachment)
    }
}