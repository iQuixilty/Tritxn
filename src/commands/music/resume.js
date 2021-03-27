const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor
const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "resume",
    category: "Music",
    aliases: ['res'],
    cooldown: 5,
    description: "Resumes currently playing music",
    usage: "\`PREFIXresume\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT'],

    execute: async function (client, message, args) {
        const res = new Discord.MessageEmbed()
        
        setCooldown(client, this, message);

        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.reply(res.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, there is nothing playing.**`)).catch((e) => console.log(e));
        if (!canModifyQueue(message.member)) return;

        if (!queue.playing) {
            queue.playing = true;
            queue.connection.dispatcher.resume();
            return queue.textChannel.send(res.setColor(message.guild.me.displayColor).setDescription(`**${message.author} ▶ resumed the music!**`)).catch((e) => console.log(e));
        }

        return message.reply(res.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, the queue is not paused.**`)).catch((e) => console.log(e));
    }
};
