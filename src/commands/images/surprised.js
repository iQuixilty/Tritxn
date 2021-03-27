const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../utils/utils')
const canvacord = require('canvacord');


module.exports = {
    name: "surprised",
    category: "Images",
    aliases: ['surp', 'surprisedpikachu'],
    description: "Dam, that surprised me",
    usage: "\`PREFIXsurprised [top text]/[bottom text]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let text = args.join(" ").split('/')
      
      
        const spE = new Discord.MessageEmbed()

        if(!args[0]) return message.channel.send(spE.setColor(message.guild.me.displayColor).setTitle('Provide something to be surprised about'))

        if (!message.content.includes('/')) {
            return message.channel.send(spE.setColor(message.guild.me.displayColor).setTitle('Use a \`/\` to seperate the top and bottom text'))
        }

        let image = await canvacord.Canvas.surprised(text[0], text[1]);

        let attachment = new Discord.MessageAttachment(image, "surprised.png")

        message.channel.send(attachment);

      
    }
}