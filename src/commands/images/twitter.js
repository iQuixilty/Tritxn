const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "tweet",
    category: "Images",
    aliases: ['twitter'],
    description: "Sends a tweet",
    usage: "\`PREFIXtweet [text]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let user =message.author;

        let text = args.join(" ");

        const tweete = new Discord.MessageEmbed()

        if (!args[0]) return message.channel.send(tweete.setColor(message.guild.me.displayColor).setTitle('Provide something to comment on'))

        let image = await canvacord.Canvas.twitter({
            username: message.author.username,
            content: text,
            avatar: user.displayAvatarURL({ format: "png", dynamic: false, size: 512 }),
            dark: false
        });

        let attachment = new MessageAttachment(image, "twitter.png");

        return message.channel.send(attachment);
    }
}