const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../utils/utils')
const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "ytcomment",
    category: "Images",
    aliases: ['ytc'],
    description: "Sends a youtube comment",
    usage: "\`PREFIXytcomment [text]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let user = message.mentions.users.first() || message.author;

        let text = args.join(" ");

        const yte = new Discord.MessageEmbed()

        if (!args[0]) return message.channel.send(yte.setColor(message.guild.me.displayColor).setTitle('Provide something to comment on'))

        let image = await canvacord.Canvas.youtube({
            username: message.author.username,
            content: text,
            avatar: user.displayAvatarURL({ format: "png", dynamic: false, size: 512 }),
            dark: true
        });

        let attachment = new MessageAttachment(image, "youtube.png");

        return message.channel.send(attachment);
    }
}