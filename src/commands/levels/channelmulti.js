const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const Levels = require('discord-xp')


/**
 * @type {import('../../typings.d').Command}
 */

module.exports = {
    name: "channelmulti",
    category: "Levels",
    aliases: ["cmulti", "chmulti"],
    description: "Sets the a XP multiplier to the specified channel",
    usage: "- \`PREFIXcmulti\` to view the current channel multipliers \n- \`PREFIXcmulti set [channel] [amount]\` to set a multiplier for a channel \n- \`PREFIXcmulti clear [channel]\` to clear the multipliers for that channel",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const embed = new Discord.MessageEmbed()
        let guildLevels = client.guildLevelsCache.get(message.guild.id)
        let channelMultiplier = guildLevels.channelMultiplier || {}
        let option = args[0]

        if (!option) {
            let desc = ''
            for (const [channel, multiplier] of Object.entries(channelMultiplier)) {
                desc += `\`${multiplier}\` | <#${channel}>\n`
            }

            return message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setTitle(`Channel Multipliers`)
                .setDescription(desc === '' ? "You have not set any channel multipliers yet!" : desc)
                .setTimestamp())
        }

        let channelM = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])

        if (!channelM) {
            return message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setDescription(`**Please specify a channel**`))
        }

        const update = { channelMultiplier: {} }
        update.channelMultiplier[channelM.id] = {}

        switch (option.toLowerCase()) {
            case 'clear':
                if (channelMultiplier[channelM.id]) {
                    delete channelMultiplier[channelM.id]

                    update.channelMultiplier = channelMultiplier
                }

                message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The multiplier for the channel **${channelM} **has been cleared**`))
                break;
            case 'set':
                if (!args[2] || isNaN(args[2])) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please specify a channel multiplier that is a number**`))

                let multi = args[2]

                if (!channelMultiplier[channelM.id]) channelMultiplier[channelM.id] = {}
                channelMultiplier[channelM.id] = multi

                update.channelMultiplier = channelMultiplier

                message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The multiplier for the channel** ${channelM} **has been set to \`${multi}\`**`))

                break;
            default:
                message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of this command**`))
                break;
        }


        guildLevels.channelMultiplier = channelMultiplier
        client.guildLevelsCache.set(message.guild.id, guildLevels)

        await client.DBLevels.findByIdAndUpdate(message.guild.id, { $set: update }, { new: true, upsert: true, setDefaultsOnInsert: true })


    }
}