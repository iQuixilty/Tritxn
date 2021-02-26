const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const Levels = require('discord-xp')
const canvacord = require('canvacord')

/**
 * @type {import('../../typings.d').Command}
 */

module.exports = {
    name: "setlevel",
    category: "Levels",
    aliases: ["stl"],
    description: "Sets the level to the specified user",
    usage: "\`PREFIXsetlevel [user] [level]\`",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const embed = new Discord.MessageEmbed()

        const target = message.mentions.users.first() || message.guild.members.cache.get(args[0])

        if (!target) return message.channel.send(embed.setColor(message.guild.me.displayColor)
            .setDescription(`**Provide who's level to change**`))

        let newLevel = args[1]

        if (!newLevel || isNaN(newLevel)) return message.channel.send(embed.setColor(message.guild.me.displayColor)
            .setDescription(`**Provide a valid amount of level(s) that you want to set to that user**`))

        const user = await Levels.setLevel(target.id, message.guild.id, newLevel)

        message.channel.send(embed
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Successfully set ${target}'s levels to \`${newLevel}\``)
            .setFooter(`${target.username} is now level ${user.level}`)
            .setColor(message.guild.me.displayColor))

    }
}