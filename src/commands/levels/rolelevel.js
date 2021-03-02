const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const Levels = require('discord-xp')


/**
 * @type {import('../../typings.d').Command}
 */

module.exports = {
    name: "rolelevel",
    category: "Levels",
    aliases: ["rlevel", "rlvl"],
    description: "Sets the role to be given once the specified level is reached",
    usage: "- \`PREFIXrolelevel\` to view the current role levels \n- \`PREFIXrolelevel set [role] [level]\` to set a role for the level \n- \`PREFIXrolelevel clear [role]\` to clear the levels for that role",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const embed = new Discord.MessageEmbed()
        let guildLevels = client.guildLevelsCache.get(message.guild.id)
        let roleLevel = guildLevels.roleLevel || {}
        let option = args[0]

        if (!option) {
            let desc = ''
            for (const [role, level] of Object.entries(roleLevel)) {
                desc += `\`${level}\` | <@&${role}>\n`
            }

            return message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setTitle(`Role Levels`)
                .setDescription(desc === '' ? "You have not set any roles to be gained at a level yet!" : desc)
                .setTimestamp())
        }

        let roleM = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

        if (!roleM) {
            return message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setDescription(`**Please specify a role**`))
        }

        const update = { roleLevel: {} }
        update.roleLevel[roleM.id] = {}

        switch (option.toLowerCase()) {
            case 'clear':
                if (roleLevel[roleM.id]) {
                    delete roleLevel[roleM.id]

                    update.roleLevel = roleLevel
                }

                message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The level for the role **${roleM} **has been cleared**`))
                break;
            case 'set':
                if (!args[2] || isNaN(args[2])) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please specify a level that is a number**`))

                if (roleM.position > message.guild.me.roles.highest.position) {
                    return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The role** ${roleM}** is higher than my own**`))
                }

                let level = args[2]

                if (!roleLevel[roleM.id]) roleLevel[roleM.id] = {}
                roleLevel[roleM.id] = level

                update.roleLevel = roleLevel

                message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The level for the role** ${roleM} **has been set to \`${level}\`**`))

                break;
            default:
                message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of this command**`))
                break;
        }


        guildLevels.roleLevel = roleLevel
        client.guildLevelsCache.set(message.guild.id, guildLevels)

        await client.DBLevels.findByIdAndUpdate(message.guild.id, { $set: update }, { new: true, upsert: true, setDefaultsOnInsert: true })


    }
}