const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "loop",
    category: "Music",
    aliases: ['l'],
    cooldown: 5,
    description: "Loops a queue",
    usage: "\`PREFIXloop\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT',],

    execute: async function (client, message, args) {
        setCooldown(client, this, message);
        
        const loop = new Discord.MessageEmbed()

        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.reply(loop.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, there is nothing playing.**`)).catch((e) => console.log(e));
        if (!canModifyQueue(message.member)) return;

        // toggle from false to true and reverse
        queue.loop = !queue.loop;
        return queue.textChannel.send(loop.setColor(message.guild.me.displayColor).setDescription(`Loop is now ${queue.loop ? "**on**" : "**off**"}`)).catch((e) => console.log(e));
    }
};
