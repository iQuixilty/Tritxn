const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../utils/utils')
const canvacord = require('canvacord');


module.exports = {
    name: "changemymind",
    category: "Images",
    aliases: ["cmm"],
    description: "Lets everyone know to change your mind",
    usage: "\`PREFIXchangemymind [text]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let text = args.join(" ");

        const cmme = new Discord.MessageEmbed()

        if (!args[0]) return message.channel.send(cmme.setColor(message.guild.me.displayColor).setTitle('Provide something to change your mind about'))

        let image = await canvacord.Canvas.changemymind(text);

        let changeMyMind = new Discord.MessageAttachment(image, "cmm.png")

        message.channel.send(changeMyMind);
    }
}