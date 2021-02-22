const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const canvacord = require('canvacord')


module.exports = {
    name: "crap",
    category: "Images",
    aliases: ['shit', 'poop'],
    description: "Someone stepped on you",
    usage: "\`PREFIXcrap [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let user = message.mentions.users.first() || message.author;

        let avatar = user.displayAvatarURL({ size: 512, format: 'png', dynamic: false })

        let shit = await canvacord.Canvas.shit(avatar);

        let attachment = new Discord.MessageAttachment(shit, "shit.png");
        return message.channel.send(attachment);
    }
}