const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../utils/utils')
const canvacord = require('canvacord');


module.exports = {
    name: "ohno",
    category: "Images",
    description: "Oh no, its stupid.",
    usage: "\`PREFIXohno [text]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let text = args.join(" ");

        const ohnoe = new Discord.MessageEmbed()

        if (!args[0]) return message.channel.send(ohnoe.setColor(message.guild.me.displayColor).setTitle('Provide something to oh no about'))

        let image = await canvacord.Canvas.ohno(text);

        let ohNo = new Discord.MessageAttachment(image, "ohno.png")

        message.channel.send(ohNo);
    }
}