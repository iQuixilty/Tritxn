const move = require("array-move");
const Discord = require('discord.js')
const { canModifyQueue } = require("../../utils/vcUtil");
const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "move",
    category: "Music",
    aliases: ["mv"],
    cooldown: 5,
    description: "Moves a song position to another position (cannot move currently playing song)",
    usage: "\`PREFIXmove [intial location] [new location]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT',],

    execute: async function (client, message, args) {
        const embed = new Discord.MessageEmbed()

        const queue = client.queue.get(message.guild.id);
        setCooldown(client, this, message);

        if (!queue) {
            return message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setDescription("**❌ There is nothing playing.**"))
                .catch((e) => console.log(e));
        }

        if (!canModifyQueue(message.member)) return;

        if (!args.length) {
            return message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setDescription("**Please specify what song you want to move and where you to move it too**"))
                .catch((e) => console.log(e));
        }

        if (isNaN(args[0]) || args[0] <= 1) {
            return message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setDescription("**Provide a valid song to move**"))
                .catch((e) => console.log(e));
        }

        if (isNaN(args[1]) || args[1] <= 1) {
            return message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setDescription("**Provide where to move the song too**"))
                .catch((e) => console.log(e));
        }

        let song = queue.songs[args[0] - 1];

        queue.songs = move(queue.songs, args[0] - 1, args[1] == 1 ? 1 : args[1] - 1);
        queue.textChannel.send(embed
            .setColor(message.guild.me.displayColor)
            .setDescription(`**${message.author} moved [${song.title}](${song.url})**`))
        
    }
};