const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "darkness",
    category: "Images",
    aliases: ['drs'],   
    description: "Changes the darkness of a profile picture",
    usage: "\`PREFIXdarkness [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
    
        let user = message.mentions.users.first() || message.author;
      
   
        let userAvatar = user.displayAvatarURL({format: 'png', dynamic: false})
        let amount = args[0]

        if (!amount) {
            amount = 1
        }

        let face = await canvacord.Canvas.darkness(userAvatar, amount)
        let attachment = new MessageAttachment(face, "darkness.png");
        return message.channel.send(attachment)
    }
}