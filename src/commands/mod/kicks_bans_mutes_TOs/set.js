const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')



/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "set",
    category: "Moderation",
    description: "Set a muted/timeout role for this server ",
    usage: `-\`PREFIXset\` to view the current muted role \n-\`PREFIXset [option] [role] [set/remove]\` to set the muted role`,
    perms: ['MANAGE_ROLES'],
    examples: `\`PREFIXset mute @Muted set\``,
    ignoreDisabledChannels: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],

    execute: async function (client, message, args) {
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

        let embed = new Discord.MessageEmbed()

        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let mutedRole = guildInfo.mutedRole
        let timeoutRole = guildInfo.timeoutRole

        let branch = args[0]


        if (!args[0]) {
            return message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setTimestamp()
                .setTitle('Server Role Settings')
                .addField(`Mute Role`, `${mutedRole === undefined ? 'None!' : `${message.guild.roles.cache.find(r => r.id === mutedRole)}`}`)
                .addField(`Time Out Role`, `${timeoutRole === undefined ? 'None!' : `${message.guild.roles.cache.find(r => r.id === timeoutRole)}`}`))
        }

        if (branch.toLowerCase() === 'mute') {
            if (role) {
                let option = args[2]
                switch (option) {
                    case 'set':
                        if (mutedRole === role.id) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`${role} **is already the muted role for this server**`))

                        if (role.position > message.guild.me.roles.highest.position) {
                            return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`${role}** is higher than my role.  Either move the role down, or my role higher.**`))
                        }

                        await client.DBGuild.findByIdAndUpdate(message.guild.id, { $set: { mutedRole: role.id } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                        guildInfo.mutedRole = role.id
                        client.guildInfoCache.set(message.guild.id, guildInfo)

                        message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`${role} **is now the muted role for this server**`))

                        break;
                    case 'remove':
                        if (mutedRole !== role.id) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`${role} **is not the muted role for this server**`))

                        guildInfo = await client.DBGuild.findByIdAndUpdate(message.guild.id, { $unset: { mutedRole: role.id } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                        client.guildInfoCache.set(message.guild.id, guildInfo)

                        message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`${role} **is no longer the muted role for this server**`))
                        break;
                    default:
                        message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                        break;
                }
            }
        } else if (branch.toLowerCase() === 'timeout') {
            if (role) {
                let option = args[2]
                switch (option) {
                    case 'set':
                        if (timeoutRole === role.id) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`${role} **is already the time out role for this server**`))

                        if (role.position > message.guild.me.roles.highest.position) {
                            return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`${role} **is higher than my role.  Either move the role down, or my role higher.**`))
                        }

                        await client.DBGuild.findByIdAndUpdate(message.guild.id, { $set: { timeoutRole: role.id } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                        guildInfo.timeoutRole = role.id
                        client.guildInfoCache.set(message.guild.id, guildInfo)

                        message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`${role} **is now the time out role for this server**`))

                        break;
                    case 'remove':
                        if (timeoutRole !== role.id) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`${role} **is not the time out role for this server**`))

                        guildInfo = await client.DBGuild.findByIdAndUpdate(message.guild.id, { $unset: { timeoutRole: role.id } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                        client.guildInfoCache.set(message.guild.id, guildInfo)

                        message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`${role} **is no longer the time out role for this server**`))
                        break;
                    default:
                        message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                        break;
                }
            }
        } else {
            return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Your two options are \`mute\` and \`timeout\`**`))
        }

    }
}