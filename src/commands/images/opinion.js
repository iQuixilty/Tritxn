const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../utils/utils')
const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "opinion",
    category: "Images",
    aliases: ['op'],
    description: "Lets everyone know about your opinion",
    usage: "\`PREFIXopinion [text]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let user = message.author;
        let userAvatar = user.displayAvatarURL({ format: 'png', dynamic: false })

        let text = args.join(' ')

        const ope = new Discord.MessageEmbed()
        if (!args[0]) return message.channel.send(ope.setColor(message.guild.me.displayColor).setTitle('Provide a opinion'))

        let image = await canvacord.Canvas.opinion(userAvatar, text)
        let attachment = new MessageAttachment(image, "opinion.png");

        return message.channel.send(attachment)
    }
}