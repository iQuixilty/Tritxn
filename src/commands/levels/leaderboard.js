const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const Levels = require('discord-xp')
const levels = require('discord-xp/models/levels')

/**
 * @type {import('../../typings.d').Command}
 */

module.exports = {
    name: "leaderboard",
    category: "Levels",
    aliases: ["xplb", "lb", "xpleaderboard"],
    description: "Displays the server leaderboard rankss",
    usage: "\`PREFIXxpleaderboard\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const embed = new Discord.MessageEmbed()

        const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10);
        const user = await Levels.fetch(message.author.id, message.guild.id, true);

        if (rawLeaderboard.length < 1) return message.reply(embed.setColor(message.guild.me.displayColor).setDescription("**Nobody's on the leaderboard yet.**"));

        const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);

        const lb = leaderboard.map(e => `**${e.position}.** **<@${e.userID}>**\n**Level:** \`${e.level}\` \n**XP:** \`${e.xp}/${e.neededXp}\``);


        message.channel.send(embed
            .setAuthor(`XP Leaderboard`, message.author.displayAvatarURL({ dynamic: true }))
            .setColor(message.guild.me.displayColor)
            .setTitle(`Leaderboard for ${message.guild.name}`)
            .setDescription(`${lb.join(`\n\n`)}`)
            .setThumbnail(message.guild.iconURL())
            .setFooter(`${message.author.username} is level ${user.level}`));

    }
}