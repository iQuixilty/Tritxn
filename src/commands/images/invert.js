const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../utils/utils')
const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "invert",
    category: "Images",
    description: "Invers the colors in a users profile picture",
    usage: "\`PREFIXinvert [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let user = message.mentions.users.first() || message.author;
        
        let image = await canvacord.Canvas.invert(user.displayAvatarURL({ format: "png", dynamic: false, size: 512 }));
        
        let attachment = new MessageAttachment(image, "deepfry.png");
        
        return message.channel.send(attachment);
    }
}