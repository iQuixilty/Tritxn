const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../utils/utils')
const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "slap",
    category: "Images",
    description: "Slaps the mentioned user",
    usage: "\`PREFIXslap [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let user = message.mentions.users.first()
        const slape = new Discord.MessageEmbed()

        if (!user) {
            return message.channel.send(slape.setColor(message.guild.me.displayColor).setTitle('Who are you trying to slap?'))
        }

        let image = await canvacord.Canvas.slap(
            message.author.displayAvatarURL({ format: "png", dynamic: false, size: 512 }),
            user.displayAvatarURL({ format: "png", dynamic: false, size: 512 })
        );

        let attachment = new MessageAttachment(image, "slap.png");

        return message.channel.send(attachment);
    }
}