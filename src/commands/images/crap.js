const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../utils/utils')
const canvacord = require('canvacord')


module.exports = {
    name: "crap",
    category: "Images",
    aliases: ['shit', 'poop'],
    description: "Someone stepped on you",
    usage: "\`PREFIXcrap [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let user = message.mentions.users.first() || message.author;

        let avatar = user.displayAvatarURL({ size: 512, format: 'png', dynamic: false })

        let shit = await canvacord.Canvas.shit(avatar);

        let attachment = new Discord.MessageAttachment(shit, "shit.png");
        return message.channel.send(attachment);
    }
}