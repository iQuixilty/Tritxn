const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor
const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "skip",
    category: "Music",
    aliases: ["s"],
    cooldown: 5,
    description: "Skips the current song",
    usage: "\`PREFIXskip\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT', 'ADD_REACTIONS'],

    execute: async function (client, message, args) {
        const skippe = new Discord.MessageEmbed()
        setCooldown(client, this, message);

        const queue = message.client.queue.get(message.guild.id);
        if (!queue)
            return message.reply(skippe.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, there is nothing playing that I could skip for you.**`)).catch((e) => console.log(e));
        if (!canModifyQueue(message.member)) return;

        queue.playing = true;
        queue.connection.dispatcher.end();
        queue.textChannel.send(skippe.setColor(message.guild.me.displayColor).setDescription(`**${message.author} ⏭ skipped the song**`)).catch((e) => console.log(e));
    }
};