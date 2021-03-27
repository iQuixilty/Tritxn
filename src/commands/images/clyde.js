const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../utils/utils')
const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "clyde",
    category: "Images",
    aliases: ['cly'],
    description: "Sends a message through Clyde",
    usage: "\`PREFIXclyde [text]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let text = args.join(' ')

        const cly = new Discord.MessageEmbed()

        if (!args[0]) return message.channel.send(cly.setColor(message.guild.me.displayColor).setTitle('Provide something for Clyde to say'))

        let image = await canvacord.Canvas.clyde(text)
        let attachment = new MessageAttachment(image, "clyde.png");
        return message.channel.send(attachment)
    }
}