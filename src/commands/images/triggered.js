const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "triggered",
    category: "Images",
    aliases: ["trig", 'trigger'],
    description: "Makes your profile picture triggered",
    usage: "\`PREFIXtriggered [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let user = message.mentions.users.first() || message.author;
        
        let triggered = await canvacord.Canvas.trigger(user.displayAvatarURL({ format: "png", dynamic: false }));
        
        let attachment = new MessageAttachment(triggered, "triggered.gif");
        
        return message.channel.send(attachment);
    }
}