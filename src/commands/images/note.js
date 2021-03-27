const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../utils/utils')
const canvacord = require('canvacord');


module.exports = {
    name: "note",
    category: "Images",
    description: "Thats a bad note",
    usage: "\`PREFIXnote [text]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let text = args.join(" ");

        const note = new Discord.MessageEmbed()

        if (!args[0]) return message.channel.send(note.setColor(message.guild.me.displayColor).setTitle('Provide something to send a note about'))
        // text.replace(/([^\n]{1,32})\s/g, '$1\n');

        let image = await canvacord.Canvas.note(text.replace(/([^\n]{1,32})\s/g, '$1\n'));

        let Note = new Discord.MessageAttachment(image, "note.png")

        message.channel.send(Note);
    }
}