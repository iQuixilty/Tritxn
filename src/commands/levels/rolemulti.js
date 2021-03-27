const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const Levels = require('discord-xp')
const {setCooldown} = require('../../utils/utils')

/**
 * @type {import('../../typings.d').Command}
 */

module.exports = {
    name: "rolemulti",
    category: "Levels",
    aliases: ["rmulti"],
    description: "Sets the a XP multiplier to the specified role",
    usage: "- \`PREFIXrmulti\` to view the current role multipliers \n- \`PREFIXrmulti set [role] [amount]\` to set a multiplier for a role\n- \`PREFIXcmulti clear [role]\` to clear the multipliers for that role",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        const embed = new Discord.MessageEmbed()
        let guildLevels = client.guildLevelsCache.get(message.guild.id)
        let roleMultiplier = guildLevels.roleMultiplier || {}
        let option = args[0]

        if (!option) {
            let desc = ''
            for (const [role, multiplier] of Object.entries(roleMultiplier)) {
                desc += `\`${multiplier}\` | <@&${role}>\n`
            }

            return message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setTitle(`Role Multipliers`)
                .setDescription(desc === '' ? "You have not set any role multipliers yet!" : desc)
                .setTimestamp())
        }

        let roleM = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

        if (!roleM) {
            return message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setDescription(`**Please specify a role**`))
        }

        const update = { roleMultiplier: {} }
        update.roleMultiplier[roleM.id] = {}

        switch (option.toLowerCase()) {
            case 'clear':
                if (roleMultiplier[roleM.id]) {
                    delete roleMultiplier[roleM.id]
                    update.roleMultiplier = roleMultiplier
                }

                message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The multiplier for the role **${roleM} **has been cleared**`))
                break;
            case 'set':
                if (!args[2] || isNaN(args[2])) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please specify a role multiplier that is a number**`))
                
                let multi = args[2]

                if (!roleMultiplier[roleM.id]) roleMultiplier[roleM.id] = {}
                roleMultiplier[roleM.id] = multi

                update.roleMultiplier = roleMultiplier

                message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The multiplier for the role** ${roleM} **has been set to \`${multi}\`**`))

                break;
            default:
                message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of this command**`))
                break;
        }
       
        guildLevels.roleMultiplier = roleMultiplier
        client.guildLevelsCache.set(message.guild.id, guildLevels)
        await client.DBLevels.findByIdAndUpdate(message.guild.id, { $set: update }, { new: true, upsert: true, setDefaultsOnInsert: true })


    }
}