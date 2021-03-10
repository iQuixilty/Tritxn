const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const autoModSchema = require('../../../../schemas/automodSchema')
const warnSchema = require('../../../../schemas/warn-schema')
const ms = require('ms')

const emoji = require('../../../../config/emoji.json')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "warn",
    category: "Moderation",
    description: "Warns a user and stores the warning",
    usage: "\`PREFIXwarn [user] [reason]\`",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let target =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0])

        const warnE = new Discord.MessageEmbed()

        if (!target) {
            message.channel.send(warnE.setColor('RED').setDescription(`**${emoji.downvote} Please specify someone to warn**`))
            return
        }

        if (target.user.bot) {
            message.channel.send(warnE.setColor('RED').setDescription(`**${emoji.downvote} Bots don\'t have warnings**`))
            return
        }


        if (args.length < 2) {
            message.channel.send(warnE.setColor('RED').setDescription(`**${emoji.downvote} Please specify a user and a reason**`))
            return;
        }

        args.shift()

        const guildId = message.guild.id
        const userId = target.id
        const reason = args.join(' ')

        const warning = {
            author: message.member.id,
            timestamp: new Date().getTime(),
            reason
        }

        await warnSchema.findOneAndUpdate({
            guildId,
            userId
        }, {
            guildId,
            userId,
            $push: {
                warnings: warning
            }
        }, {
            upsert: true,
        })

        message.channel.send(warnE
            .setColor(message.guild.me.displayColor)
            .setAuthor(`New warning for: ${target.user.username}`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`**<@${userId}> has been warned for: \`${reason}\`**`)
            .setFooter(`Moderator Responsible: ${message.author.tag}`))

        target.send(new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setDescription(`**You have been warned in ${message.guild.name} for \`${reason}\`**`))
            .catch((e) => {
                console.log(`I couldnt DM the user`)
            })


        const results = await autoModSchema.findOne({
            guildId,
        })
        const warns = await warnSchema.findOne({
            guildId,
            userId,
        })
        if (results === undefined || results === null) return;
        let warnAutomod = results.warnAutomod
        let amounts = []
        let typeOfPunishment = []
        let time = []

        for (const [amount, punishment] of Object.entries(warnAutomod)) {
            let arg = punishment.split(' ')
            amounts.push(amount)
            typeOfPunishment.push(arg[0])
            if (arg[0] === 'mute') time.push(ms(arg[1]))
        }


        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let mutedRole = guildInfo.mutedRole
        let role = message.guild.roles.cache.get(mutedRole)

        for (let i = 0; i < amounts.length; i++) {
            if (parseInt(amounts[i]) === warns.warnings.length) {
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
                    target.kick({ reason: `Reached ${amounts[i]} Warnings` }).catch((e) => {
                        message.channel.send(new Discord.MessageEmbed()
                            .setColor(message.guild.me.displayColor)
                            .setDescription(x + 'js' + `\n${e}` + x)
                            .setFooter(`If this error occurs again, please inform Qzxy#4227`))
                    })
                } else if (typeOfPunishment[i].toLowerCase() === 'ban') {
                    target.ban({ reason: `Reached ${amounts[i]} Warnings` }).catch((e) => {
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