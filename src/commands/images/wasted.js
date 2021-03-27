const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../utils/utils')
const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "wasted",
    category: "Images",
    description: "That user is wasted!",
    usage: "\`PREFIXwasted [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let user = message.mentions.users.first() || message.author;

        let image = await canvacord.Canvas.wasted(user.displayAvatarURL({ format: "png", dynamic: false, size: 512 }));

        let attachment = new MessageAttachment(image, "wanted.png");

        return message.channel.send(attachment);
    }
}