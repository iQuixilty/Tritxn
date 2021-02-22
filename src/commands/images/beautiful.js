const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

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
    
        let user = message.mentions.users.first() || message.author;
      
   
        let userAvatar = user.displayAvatarURL({format: 'png', dynamic: false})

        let face = await canvacord.Canvas.beautiful(userAvatar)
        let attachment = new MessageAttachment(face, "beautiful.png");
        return message.channel.send(attachment)
    }
}