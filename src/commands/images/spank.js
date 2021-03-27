const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../utils/utils')
const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "spank",
    aliases: ['beat'],
    category: "Images",
    description: "Spanks the mentioned user",
    usage: "\`PREFIXspank [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let user = message.mentions.users.first()
        const slape = new Discord.MessageEmbed()

        if (!user) {
            return message.channel.send(slape.setColor(message.guild.me.displayColor).setTitle('Who are you trying to spank?'))
        }

        let image = await canvacord.Canvas.spank(
            message.author.displayAvatarURL({ format: "png", dynamic: false, size: 512 }),
            user.displayAvatarURL({ format: "png", dynamic: false, size: 512 })
        );

        let attachment = new MessageAttachment(image, "spank.png");

        return message.channel.send(attachment);
    }
}