const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const Levels = require('discord-xp')


/**
 * @type {import('../../typings.d').Command}
 */

module.exports = {
    name: "givexp",
    category: "Levels",
    aliases: ["gxp", "addxp", "axp"],
    description: "Gives the XP amount to the specified user",
    usage: "\`PREFIXgivexp [user] [xp]\`",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const embed = new Discord.MessageEmbed()

        const target = message.mentions.users.first() || message.guild.members.cache.get(args[0])

        if (!target) return message.channel.send(embed.setColor(message.guild.me.displayColor)
        .setDescription(`**Provide who's XP to change**`))

        let newXp = args[1]
        
        if (!newXp || isNaN(newXp)) return message.channel.send(embed.setColor(message.guild.me.displayColor)
        .setDescription(`**Provide a valid amount of XP you want to give that user**`))

        if (newXp > 300000 || newXp < 1) return message.channel.send(embed.setColor(message.guild.me.displayColor)
            .setDescription(`**The max amount of XP you can add is 300000**`))

        const user = await Levels.appendXp(target.id, message.guild.id, newXp)
        const userXP = await Levels.fetch(target.id, message.guild.id)

        message.channel.send(embed
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Successfully added \`${newXp}\` XP to ${target}`)
            .setFooter(`They now have ${userXP.xp} XP`)
            .setColor(message.guild.me.displayColor))
      

    }
}