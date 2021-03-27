const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../utils/utils')
const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "suntzu",
    aliases: ['suntsu'],
    category: "Images",
    description: "Gives a quote by the great Sun Tzu",
    usage: "\`PREFIXsuntzu [text]\`",
    devOnly: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        const embed = new Discord.MessageEmbed()

        let text = args.join(' ')
        if (!text) {
            return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**What should Sun Tzu say?**`))
        }
        message.delete()
        let image = await canvacord.Canvas.suntzu(text);

        let attachment = new MessageAttachment(image, "suntzu.png");

        return message.channel.send(attachment);
    }
}