const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "fry",
    aliases: ['deepfry', 'df'],
    category: "Images",
    description: "Fries a users profile picture",
    usage: "\`PREFIXfry [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let user = message.mentions.users.first() || message.author;
        
        let image = await canvacord.Canvas.sharpen(user.displayAvatarURL({ format: "png", dynamic: false, size: 512 }), 3);
        
        let attachment = new MessageAttachment(image, "deep_fry.png");
        
        return message.channel.send(attachment);
    }
}