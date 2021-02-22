const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "trash",
    category: "Images",
    aliases: ['garbage'],
    description: "Shows someones true colors",
    usage: "\`PREFIXtrash [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let user = message.mentions.users.first() || message.author;
        
        let image = await canvacord.Canvas.trash(user.displayAvatarURL({ format: "png", dynamic: false, size: 512 }));
        
        let attachment = new MessageAttachment(image, "trash.png");
        
        return message.channel.send(attachment);
    }
}