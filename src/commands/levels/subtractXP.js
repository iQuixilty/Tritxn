const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const Levels = require('discord-xp')


/**
 * @type {import('../../typings.d').Command}
 */

module.exports = {
    name: "removexp",
    category: "Levels",
    aliases: ["rxp", "subtractxp", "sxp"],
    description: "Subtracts the XP amount from the specified user",
    usage: "\`PREFIXremoveexp [user] [xp]\`",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const embed = new Discord.MessageEmbed()

        const target = message.mentions.users.first() || message.guild.members.cache.get(args[0])

        if (!target) return message.channel.send(embed.setColor(message.guild.me.displayColor)
        .setDescription(`**Provide who's XP to change**`))

        let newXp = args[1]
        
        if (!newXp || isNaN(newXp)) return message.channel.send(embed.setColor(message.guild.me.displayColor)
        .setDescription(`**Provide a valid amount of XP you want to remove from that user**`))

        const userXP = await Levels.fetch(target.id, message.guild.id)

        if (userXP.xp < newXp) return message.channel.send(embed.setColor(message.guild.me.displayColor)
        .setDescription(`**You cannot remove more XP then what the user has**`))

        if (newXp > 300000 || newXp < 1) return message.channel.send(embed.setColor(message.guild.me.displayColor)
            .setDescription(`**The max amount of XP you can remove is 300000**`))

        const user = await Levels.subtractXp(target.id, message.guild.id, newXp)
        

        message.channel.send(embed
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Successfully removed \`${newXp}\` XP from ${target}`)
            .setFooter(`They now have ${userXP.xp - newXp} XP`)
            .setColor(message.guild.me.displayColor))
      

    }
}