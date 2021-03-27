const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../utils/utils')
const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "jail",
    category: "Images",
    description: "Sends you to jail",
    usage: "\`PREFIXjail [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let user = message.mentions.users.first() || message.author;
        
        let image = await canvacord.Canvas.jail(user.displayAvatarURL({ format: "png", dynamic: false, size: 512 }));
        
        let attachment = new MessageAttachment(image, "jail.png");
        
        return message.channel.send(attachment);
    }
}