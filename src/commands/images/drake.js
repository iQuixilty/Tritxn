const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../utils/utils')
const canvacord = require('canvacord');


module.exports = {
    name: "drake",
    category: "Images",
    aliases: ['drakeyes', 'drakeno', 'nah'],
    description: "Drake meme template",
    usage: "\`PREFIXdrake [top text]/[bottom text]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let text = args.join(" ").split('/')
      
      
        const drE = new Discord.MessageEmbed()

        if(!args[0]) return message.channel.send(drE.setColor(message.guild.me.displayColor).setTitle('Provide something for Drake to say'))

        if (!message.content.includes('/')) {
            return message.channel.send(drE.setColor(message.guild.me.displayColor).setTitle('Use a \`/\` to seperate the top and bottom text'))
        }

        let image = await canvacord.Canvas.drake(text[0], text[1]);

        let attachment = new Discord.MessageAttachment(image, "drake.png")

        message.channel.send(attachment);

      
    }
}