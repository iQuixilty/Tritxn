const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const modLogSchema = require('../../../../schemas/modLogSchema')
const autoModSchema = require('../../../../schemas/automodSchema')
const { paginate } = require('../../../utils/utils')

const emoji = require('../../../../config/emoji.json')
const moment = require('moment')
const ms = require('ms')


/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "modlog",
    category: "Moderation",
    description: "Displays the mod log of a user",
    aliases: ['modlogs', 'mls', 'ml'],
    usage: "\`PREFIXmodlog [user]\`",
    perms: ['MANAGE_GUILD'],
    ignoreDisabledChannels: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let target =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.member;
        const guildId = message.guild.id
        const userId = target.id


        const warningE = new Discord.MessageEmbed()

        if (!target) {
            message.channel.send(warningE.setColor('RED').setDescription(`**${emoji.downvote} Please specify a user to check the modlogs for**`))
            return
        }

        if (target.bot) {
            message.channel.send(warningE.setColor('RED').setDescription(`**${emoji.downvote} Bots don\'t have mod logs**`))
            return
        }


        const results = await modLogSchema.findOne({
            guildId,
            userId,
        })

        if (results === null) {
            message.channel.send(warningE
                .setColor('RED')
                .setDescription(`**${emoji.downvote} There are no mod logs for this user**`))
            return;
        }


        let counter = 1;
        let embeds = [];

        while (results.modlogs.length > 0) {
            let reply = ""
            for (let i = 0; i < 5; i++) {
                if (!results.modlogs[0]) break;
                const { author, timestamp, reason, type } = results.modlogs.shift()
                reply += `${counter}. **${type}**\nIssued By: <@${author}> **|** Issued at: **${moment(timestamp).format("MMM DD YYYY")}** \nReason: \`${reason}\`\n\n`
                counter++
            }

            let embed = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL())
                .setAuthor(`Mod Logs for ${target.user.username}`, target.user.displayAvatarURL())
                .setThumbnail(message.guild.iconURL())
                .setDescription(reply)

            embeds.push(embed)
        }

        paginate(message, embeds, { time: 1000 * 30 })

        const newResults = await autoModSchema.findOne({
            guildId,
        })
        const modlogs = await modLogSchema.findOne({
            guildId,
            userId,
        })
        if (newResults === undefined || newResults === null || newResults.modlogAutomod === undefined) return;
        let modlogAutomod = newResults.modlogAutomod
        let amounts = []
        let typeOfPunishment = []
        let time = []

        for (const [amount, punishment] of Object.entries(modlogAutomod)) {
            let arg = punishment.split(' ')
            amounts.push(amount)
            typeOfPunishment.push(arg[0])
            if (arg[0] === 'mute') time.push(ms(arg[1]))
        }


        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let mutedRole = guildInfo.mutedRole
        let role = message.guild.roles.cache.get(mutedRole)

        for (let i = 0; i < amounts.length; i++) {
            if (parseInt(amounts[i]) === modlogs.modlogs.length) {
                if (typeOfPunishment[i].toLowerCase() === 'mute') {
                    if (mutedRole === undefined) return
                    target.roles.add(role).catch((e) => {
                        message.channel.send(new Discord.MessageEmbed()
                            .setColor(message.guild.me.displayColor)
                            .setDescription(x + 'js' + `\n${e}` + x)
                            .setFooter(`If this error occurs again, please inform Qzxy#4227`))
                    })

                    setTimeout(async () => {
                        target.roles.remove(role).catch((e) => {
                            message.channel.send(new Discord.MessageEmbed()
                                .setColor(message.guild.me.displayColor)
                                .setDescription(x + 'js' + `\n${e}` + x)
                                .setFooter(`If this error occurs again, please inform Qzxy#4227`))
                        })
                    }, time[i])
                } else if (typeOfPunishment[i].toLowerCase() === 'kick') {
                    target.kick({ reason: `Reached ${amounts[i]} Modlogs` }).catch((e) => {
                        message.channel.send(new Discord.MessageEmbed()
                            .setColor(message.guild.me.displayColor)
                            .setDescription(x + 'js' + `\n${e}` + x)
                            .setFooter(`If this error occurs again, please inform Qzxy#4227`))
                    })
                } else if (typeOfPunishment[i].toLowerCase() === 'ban') {
                    target.ban({ reason: `Reached ${amounts[i]} Modlogs` }).catch((e) => {
                        message.channel.send(new Discord.MessageEmbed()
                            .setColor(message.guild.me.displayColor)
                            .setDescription(x + 'js' + `\n${e}` + x)
                            .setFooter(`If this error occurs again, please inform Qzxy#4227`))
                    })
                }
            }
        }


    }
}