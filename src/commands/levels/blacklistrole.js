const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const Levels = require('discord-xp')
/**
 * @type {import('../../typings.d').Command}
 */


module.exports = {
    name: "blacklistrole",
    category: "Levels",
    aliases: ["brole"],
    usage: "- \`PREFIXblacklistrole\` to display all currently blacklisted roles\n- \`PREFIXblacklistrole [role] [blacklist/whitelist]\` to blacklist/whitelist roles .",
    description: "Allows you to blacklist and whitelist roles so that members with the blacklisted role do not gain any XP",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let guildLevels = client.guildLevelsCache.get(message.guild.id);
        let blacklistedRoles = guildLevels.blacklistedRoles;

        const embed = new Discord.MessageEmbed()
            .setTimestamp()

        if (!args[0]) {
            embed
                .setColor(message.guild.me.displayColor)
                .setTitle('Blacklisted Roles')
                .setDescription(blacklistedRoles.length === 0 ? 'There are no blacklisted roles in this server!' : '<@&' + blacklistedRoles.join('>\n\n <@&') + '>')

            return message.channel.send(embed)
        }


        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])

        if (!role) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The role ${args[0]} does not exist.**`))
        // if (channel.type !== 'text') return message.channel.send(channelEmbed.setColor(message.guild.me.displayColor).setDescription(`**You can only disable text channels.**`))

        switch (args[1]) {
            case 'blacklist':
                if (blacklistedRoles.includes(role.id)) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The role **${role}** is already blacklisted.**`))

                await client.DBLevels.findByIdAndUpdate(message.guild.id, { $push: { blacklistedRoles: role.id } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                guildLevels.blacklistedRoles.push(role.id)
                client.guildLevelsCache.set(message.guild.id, guildLevels)

                message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The role **${role}** has been blacklisted.**`))
                break;
            case 'whitelist':
                if (!blacklistedRoles.includes(role.id)) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The role **${role}** is already whitelisted.**`))

                guildLevels = await client.DBLevels.findByIdAndUpdate(message.guild.id, { $pull: { blacklistedRoles: role.id } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                client.guildLevelsCache.set(message.guild.id, guildLevels)

                message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The role **${role}** has been whitelisted.**`))
                break;
            default:
                message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author} please check the usage of the command.**`))
                break;
        }
    }
}
