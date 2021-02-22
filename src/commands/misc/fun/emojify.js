const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const emoji = require('discord-emoji-convert');

module.exports = {
    name: "emojify",
    category: "Misc",
    aliases: ["efy"],
    description: "Emojifies a string of text",
    usage: "\`PREFIXemojify [text]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        var arg = message.content.split(" ").slice(1).join(" ")

        if (message.content.includes('bald')) {
            return;
        }

        if (!arg) return message.channel.send(new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle('What do you want me to emojify?'))

        if (arg.length > 90) return message.channel.send(new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle('Your text is too long | Please keep it under 90 characters'))

        let emojis = emoji.convert(arg)
        message.channel.send(emojis).catch((_err) => {
            message.channel.send(arg)
        })
    }
}