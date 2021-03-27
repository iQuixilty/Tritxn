const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
let x = '```'
const { paginate, errorMessage, msToTime } = require('../../../utils/utils')
const ms = require('ms')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "role",
    aliases: ['rle'],
    category: "Moderation",
    description: "",
    usage: "\`PREFIXrole <flag> <option>\`",
    perms: ['MANAGE_ROLES'],
    clientPerms: ['SEND_MESSAGES', 'MANAGE_ROLES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const embed = new Discord.MessageEmbed()
        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let prefix = guildInfo.prefix

        let flag = args[0]

        if (!flag) {
            return message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setAuthor(`Role Flags For ${message.guild.name}`)
                .addField(`Add A Role`, `Add a role to the mentioned user\n` + x + `${prefix}role --add [user] [role]` + x,)
                .addField(`Remove A Role`, `Remove a role from the mentioned user\n` + x + `${prefix}role --remove [user] [role]` + x,)
                .addField(`Create A Role`, `Create a role in the server\n` + x + `${prefix}role --create <role name> <role color> <hosisted> <position>` + x,)
                .addField(`Delete A Role`, `Deletes a role in the server\n` + x + `${prefix}role --delete [role]` + x,)
                .addField(`Add A Role Temporarily`, `Gives a person a role temporarily\n` + x + `${prefix}role --temprole [user] [role]` + x,)
                .setFooter(`[] Required ┃ <> Optional`)
                .setThumbnail(message.guild.iconURL()))
        }

        if (flag.toLowerCase() === '--add') {
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[1])

            if (!user) {
                message.channel.send(embed.setColor('RED').setDescription(`**${message.author} please mention who to add a role too**`)).catch((e) => { errorMessage(client, message, e) })
                return;
            }

            let roleId = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])

            if (!roleId) {
                return message.channel.send(embed.setColor('RED').setDescription(`**${message.author} please add what role you want to add to the user**`)).catch((e) => { errorMessage(client, message, e) })
            }

            let botHighestRole = message.guild.me.roles.highest;
            if (roleId.position >= botHighestRole.position) {
                return message.channel.send(embed.setColor('RED').setDescription(`**${message.author} that role is higher than my own**`)).catch((e) => { errorMessage(client, message, e) })
            }

            let highestRole = message.member.roles.highest;
            if (roleId.position >= highestRole.position) {
                return message.channel.send(embed.setColor('RED').setDescription(`**${message.author} you cant add a role higher than yourself**`)).catch((e) => { errorMessage(client, message, e) })
            }

            user.roles.add(roleId).catch((e) => { errorMessage(client, message, e) })

            message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setDescription(`**Added the **${roleId}** role to **${user}** successfully**`))
        } else if (flag.toLowerCase() === '--remove') {
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[1])

            if (!user) {
                message.channel.send(embed
                    .setColor('RED')
                    .setDescription(`**${message.author} please mention who to remove a role from**`)).catch((e) => { errorMessage(client, message, e) })
                return;
            }

            let roleId = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])

            if (!roleId) {
                return message.channel.send(embed
                    .setColor('RED')
                    .setDescription(`**${message.author} please add what role you want to remove from the user**`)).catch((e) => { errorMessage(client, message, e) })
            }

            let highestRole = message.member.roles.highest;
            if (roleId.position >= highestRole.position) {
                return message.channel.send(embed
                    .setColor('RED')
                    .setDescription(`**${message.author} you cant remove a role higher than yourself**`)).catch((e) => { errorMessage(client, message, e) })
            }


            user.roles.remove(roleId).catch((e) => { errorMessage(client, message, e) })

            message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setDescription(`**Removed the** ${roleId} **role from **${user} **successfully**`)).catch((e) => { errorMessage(client, message, e) })
        } else if (flag.toLowerCase() === '--temprole') {
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[1])

            if (!user) {
                message.channel.send(embed.setColor('RED').setDescription(`**${message.author} please mention who to add a role too**`)).catch((e) => { errorMessage(client, message, e) })
                return;
            }

            let roleId = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])

            if (!roleId) {
                return message.channel.send(embed.setColor('RED').setDescription(`**${message.author} please specify what role you want to add to the user**`)).catch((e) => { errorMessage(client, message, e) })
            }

            let botHighestRole = message.guild.me.roles.highest;
            if (roleId.position >= botHighestRole.position) {
                return message.channel.send(embed.setColor('RED').setDescription(`**${message.author} that role is higher than my own**`)).catch((e) => { errorMessage(client, message, e) })
            }

            let highestRole = message.member.roles.highest;
            if (roleId.position >= highestRole.position) {
                return message.channel.send(embed.setColor('RED').setDescription(`**${message.author} you cant add a role higher than yourself**`)).catch((e) => { errorMessage(client, message, e) })
            }

            let time = args[3]
            if (!time || isNaN(ms(time))) {
                return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author} please provide a valid time`)).catch((e) => { errorMessage(client, message, e) })
            }

            user.roles.add(roleId).catch((e) => { errorMessage(client, message, e) })

            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Added the **${roleId}** role to **${user}** successfully for \`${ms(ms(time), { long: true })}\`**`))

            setTimeout(async () => {
                if (!user.roles.cache.has(roleId.id)) {
                    return
                }
                user.roles.remove(roleId).catch((e) => { errorMessage(client, message, e) })
            }, ms(time))
        } else if (flag.toLowerCase() === '--delete') {
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

            if (!role) {
                return message.channel.send(embed.setColor('RED').setDescription(`**${message.author} please specify a role you want to delete**`)).catch((e) => { errorMessage(client, message, e) })
            }

            let botHighestRole = message.guild.me.roles.highest;
            if (role.position >= botHighestRole.position) {
                return message.channel.send(embed.setColor('RED').setDescription(`**${message.author} that role is higher than my own**`)).catch((e) => { errorMessage(client, message, e) })
            }

            let highestRole = message.member.roles.highest;
            if (role.position >= highestRole.position) {
                return message.channel.send(embed.setColor('RED').setDescription(`**${message.author} you cant delete a role higher than yourself**`)).catch((e) => { errorMessage(client, message, e) })
            }

            role.delete().catch((e) => { errorMessage(client, message, e) })

            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Deleted the role** \`${role.name}\`** successfully**`))
        } else if (flag.toLowerCase() === '--create') {
            let roleName = args[1]

            if (!roleName) {
                roleName = 'New Role'
            }

            let roleColor = args[2]
            let roleColorRegex = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i

            if (!roleColor) {
                roleColor = '#000000'
            }

            let result = roleColorRegex.test(roleColor)

            if (!result) {
                return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author} that is not a valid hex color**`))
            }

            let hoistOption = args[3]

            if (!hoistOption) {
                hoistOption = false
            }
            if (hoistOption && hoistOption !== 'true') {
                return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author} that is not a valid hoist option**`))
            }

            let position = args[4]

            if (!position) {
                position = 1
            }

            if (position && (isNaN(position) || position < 0)) {
                return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author} that is not a valid position**`))
            }


            message.guild.roles.create({
                data: {
                    name: roleName,
                    color: roleColor,
                    hoist: hoistOption,
                    position: position
                }
            }).catch((e) => { errorMessage(client, message, e) })

            return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Successfully created the role**` + x + `Name: ${roleName}\nColor: ${roleColor}\nHoisted: ${hoistOption}\nPosition: ${position}` + x))

        } else {
            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author} that is not a valid flag**`))
        }

    }
}


