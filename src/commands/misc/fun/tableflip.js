const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../../utils/utils')
const frames = [
    "(-°□°)-  ┬─┬",
    "(╯°□°)╯    ]",
    "(╯°□°)╯  ︵  ┻━┻",
    "(╯°□°)╯       [",
    "(╯°□°)╯           ┬─┬",
  ];
   

module.exports = {
    name: "tableflip",
    category: "Misc",
    aliases: ["tf"],
    description: "Flips a table",
    usage: "\`PREFIXtableflip\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        const frame = frames[Math.floor(Math.random() * frames.length)];
        message.channel.send(new Discord.MessageEmbed().setColor(message.guild.me.displayColor).setTitle(frame));
    }
}