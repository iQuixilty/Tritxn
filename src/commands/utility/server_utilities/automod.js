const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { paginate } = require('../../../utils/utils')
let x = '```'
const ms = require('ms')
const autoModSchema = require('../../../../schemas/automodSchema')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "automod",
    category: "Utility",
    canNotDisable: true,
    aliases: ['am'],
    ignoreDisabledChannels: true,
    description: "Set up automod for your server so that after the amount of specified warns or modlogs, they will get the specified punishment",
    // someServers: ['769013789412032572', '796125520961994764'],
    usage: "- \`PREFIXautomod\` to display the current automoderation settings\n- \`PREFIXautomod [] []\` .",
    clientPerms: ['MANAGE_GUILD'],

    execute: async function (client, message, args) {
        const embed = new Discord.MessageEmbed()

        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let prefix = guildInfo.prefix
        let guildId = message.guild.id

        const results = await autoModSchema.findOne({
            guildId,
        })
        let warnAutomod;
        results === undefined ?
            warnAutomod = {} :
            results.warnAutomod === undefined ?
                warnAutomod = {} : warnAutomod = results.warnAutomod
        let modlogAutomod;
        results === undefined ?
            modlogAutomod = {} :
            results.modlogAutomod === undefined ?
                modlogAutomod = {} : modlogAutomod = results.modlogAutomod

        let flags = args[0]

        if (!flags) {
            let embeds = []
            let options = ['Main Settings', 'Automod For Warns', 'Automod For Modlogs']
            let desc = ``
            for (let i = 0; i < options.length; i++) {
                desc += `\`#${i + 1}\` \`${options[i]}\`\n\n`
            }

            const firstSetting = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Automod Overview For ${message.guild.name}`)
                .setDescription(`Here is a guide to all the automoderation you can customize for your server \n\n${desc}`)
                .setFooter(`React with 🔢 and then type the number in front of the setting you wish to see!`)
            embeds.push(firstSetting)

            let warnDesc = ''
            if (warnAutomod) {
                for (const [amount, punishment] of Object.entries(warnAutomod)) {
                    warnDesc += `${amount} Warning${parseInt(amount) > 1 ? 's' : ''} ➢ ${punishment}\n`
                }
            }


            let warnAMEmbed = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Warn Auto-Moderation Settings For ${message.guild.name}`)
                .setDescription(`With warn automoderation enabled, I will automatically punish a user once they reach a specific amount of warns with the given punishment\n\n\`${prefix}automod\` to view the current automoderation\n\`${prefix}automod --warns set [amount of modlogs] [punishment] <time>\` to set a punishment, time is only needed for the \`mute\` punishment\n\`${prefix}automod --warns clear [amount of modlogs] [punishment]\` to remove a punishment. On default, no actions will be taken automatically\n\n**Warn Auto-Moderation Settings**` + x + `Automod: ${warnDesc === '' ? 'None!' : `\n${warnDesc}`}` + x)
            embeds.push(warnAMEmbed)


            let modlogDesc = ''
            if (modlogAutomod) {
                for (const [amount, punishment] of Object.entries(modlogAutomod)) {
                    modlogDesc += `${amount} Modlog${parseInt(amount) > 1 ? 's' : ''} ➢ ${punishment}\n`
                }
            }


            let modlogAMEmbed = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Modlog Auto-Moderation Settings For ${message.guild.name}`)
                .setDescription(`With modlog automoderation enabled, I will automatically punish a user once they reach a specific amount of modlogs with the given punishment\n\n\`${prefix}automod\` to view the current automoderation\n\`${prefix}automod --modlogs set [amount of warns] [punishment] <time>\` to set a punishment, time is only needed for the \`mute\` punishment\n\`${prefix}automod --modlogs clear [amount of warns] [punishment]\` to remove a punishment. On default, no actions will be taken automatically\n\n**Modlog Auto-Moderation Settings**` + x + `Modlog: ${modlogDesc === '' ? 'None!' : `\n${modlogDesc}`}` + x)
            embeds.push(modlogAMEmbed)


            return paginate(message, embeds, { time: 30000 })
        }

        if (flags.toLowerCase() === '--warn' || flags.toLowerCase() === '--warns') {
            let option = args[1]
            let amountOfWarns = args[2]

            const update = { warnAutomod: {} }
            update.warnAutomod[amountOfWarns] = {}

            if (!amountOfWarns || isNaN(amountOfWarns)) return message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setDescription(`**Specify an amount of warns**`))

            let punishments = ['kick', 'ban', 'mute']
            let punishment = args[3]

            if (punishments.includes(punishment)) {
                if (punishment === 'mute') {
                    switch (option.toLowerCase()) {
                        case 'clear':
                            if (warnAutomod[amountOfWarns]) {
                                delete warnAutomod[amountOfWarns]

                                update.warnAutomod = warnAutomod
                            }

                            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The automoderation for  \`${amountOfWarns}\` warning${amountOfWarns > 1 ? 's' : ''} have been cleared**`))

                            break;
                        case 'set':
                            let time = args[4]

                            if (!time || isNaN(ms(time)) || ms(time) <= 1000) return message.channel.send(embed
                                .setColor(message.guild.me.displayColor)
                                .setDescription(`**Please provide a time for how long the user will be muted for**`))

                            if (!warnAutomod[amountOfWarns]) warnAutomod[amountOfWarns] = {}
                            warnAutomod[amountOfWarns] = punishment + ' ' + time

                            update.warnAutomod = warnAutomod

                            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Now when a user reaches \`${amountOfWarns}\` warnings they will be \`muted\` for \`${ms(ms(time), { long: true })}\`**`))

                            break;
                        default:
                            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of this command**`))

                            break;
                    }

                    await autoModSchema.findOneAndUpdate({
                        guildId
                    }, {
                        guildId,
                        $set: update
                    }, {
                        upsert: true
                    })
                } else if (punishment === 'kick') {
                    switch (option.toLowerCase()) {
                        case 'clear':
                            if (warnAutomod[amountOfWarns]) {
                                delete warnAutomod[amountOfWarns]

                                update.warnAutomod = warnAutomod
                            }

                            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The automoderation for  \`${amountOfWarns}\` warning${amountOfWarns > 1 ? 's' : ''} have been cleared**`))

                            break;
                        case 'set':


                            if (!warnAutomod[amountOfWarns]) warnAutomod[amountOfWarns] = {}
                            warnAutomod[amountOfWarns] = punishment

                            update.warnAutomod = warnAutomod

                            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Now when a user reaches \`${amountOfWarns}\` warnings they will be \`kicked\` from the server**`))

                            break;
                        default:
                            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of this command**`))

                            break;
                    }

                    await autoModSchema.findOneAndUpdate({
                        guildId
                    }, {
                        guildId,
                        $set: update
                    }, {
                        upsert: true
                    })
                } else if (punishment === 'ban') {
                    switch (option.toLowerCase()) {
                        case 'clear':
                            if (warnAutomod[amountOfWarns]) {
                                delete warnAutomod[amountOfWarns]

                                update.warnAutomod = warnAutomod
                            }

                            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The automoderation for  \`${amountOfWarns}\` warning${amountOfWarns > 1 ? 's' : ''} have been cleared**`))

                            break;
                        case 'set':


                            if (!warnAutomod[amountOfWarns]) warnAutomod[amountOfWarns] = {}
                            warnAutomod[amountOfWarns] = punishment

                            update.warnAutomod = warnAutomod

                            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Now when a user reaches \`${amountOfWarns}\` warnings they will be \`banned\` from the server**`))

                            break;
                        default:
                            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of this command**`))

                            break;
                    }

                    await autoModSchema.findOneAndUpdate({
                        guildId
                    }, {
                        guildId,
                        $set: update
                    }, {
                        upsert: true
                    })
                }
            } else {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**Punishment options are:**` + x + 'mute, kick, ban' + x))
            }
        } else if (flags.toLowerCase() === '--modlog' || flags.toLowerCase() === '--modlogs' || flags.toLowerCase() === '--mls') {
            let option = args[1]
            let amountOfModlogs = args[2]

            const update = { modlogAutomod: {} }
            update.modlogAutomod[amountOfModlogs] = {}

            if (!amountOfModlogs || isNaN(amountOfModlogs)) return message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setDescription(`**Specify an amount of modlogs**`))

            let punishments = ['kick', 'ban', 'mute']
            let punishment = args[3]

            if (punishments.includes(punishment)) {
                if (punishment === 'mute') {
                    switch (option.toLowerCase()) {
                        case 'clear':
                            if (modlogAutomod[amountOfModlogs]) {
                                delete modlogAutomod[amountOfModlogs]

                                update.modlogAutomod = modlogAutomod
                            }

                            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The automoderation for  \`${amountOfModlogs}\` modlogs${amountOfModlogs > 1 ? 's' : ''} have been cleared**`))

                            break;
                        case 'set':
                            let time = args[4]

                            if (!time || isNaN(ms(time)) || ms(time) <= 1000) return message.channel.send(embed
                                .setColor(message.guild.me.displayColor)
                                .setDescription(`**Please provide a time for how long the user will be muted for**`))

                            if (!modlogAutomod[amountOfModlogs]) modlogAutomod[amountOfModlogs] = {}
                            modlogAutomod[amountOfModlogs] = punishment + ' ' + time

                            update.modlogAutomod = modlogAutomod

                            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Now when a user reaches \`${amountOfModlogs}\` modlog${amountOfModlogs > 1 ? 's' : ''} they will be \`muted\` for \`${ms(ms(time), { long: true })}\`**`))

                            break;
                        default:
                            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of this command**`))

                            break;
                    }

                    await autoModSchema.findOneAndUpdate({
                        guildId
                    }, {
                        guildId,
                        $set: update
                    }, {
                        upsert: true
                    })
                } else if (punishment === 'kick') {
                    switch (option.toLowerCase()) {
                        case 'clear':
                            if (modlogAutomod[amountOfModlogs]) {
                                delete modlogAutomod[amountOfModlogs]

                                update.modlogAutomod = modlogAutomod
                            }

                            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The automoderation for  \`${amountOfModlogs}\` modlog${amountOfModlogs > 1 ? 's' : ''} have been cleared**`))

                            break;
                        case 'set':
                            if (!modlogAutomod[amountOfModlogs]) modlogAutomod[amountOfModlogs] = {}
                            modlogAutomod[amountOfModlogs] = punishment

                            update.modlogAutomod = modlogAutomod

                            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Now when a user reaches \`${amountOfModlogs}\` modlogs they will be \`kicked\` from the server**`))

                            break;
                        default:
                            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of this command**`))

                            break;
                    }

                    await autoModSchema.findOneAndUpdate({
                        guildId
                    }, {
                        guildId,
                        $set: update
                    }, {
                        upsert: true
                    })
                } else if (punishment === 'ban') {
                    switch (option.toLowerCase()) {
                        case 'clear':
                            if (modlogAutomod[amountOfModlogs]) {
                                delete modlogAutomod[amountOfModlogs]

                                update.modlogAutomod = modlogAutomod
                            }

                            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The automoderation for  \`${amountOfModlogs}\` modlog${amountOfModlogs > 1 ? 's' : ''} have been cleared**`))

                            break;
                        case 'set':
                            if (!modlogAutomod[amountOfModlogs]) modlogAutomod[amountOfModlogs] = {}
                            modlogAutomod[amountOfModlogs] = punishment

                            update.modlogAutomod = modlogAutomod

                            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Now when a user reaches \`${amountOfModlogs}\` modlog${amountOfModlogs > 1 ? 's' : ''} they will be \`banned\` from the server**`))

                            break;
                        default:
                            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of this command**`))

                            break;
                    }

                    await autoModSchema.findOneAndUpdate({
                        guildId
                    }, {
                        guildId,
                        $set: update
                    }, {
                        upsert: true
                    })
                }
            } else {
                return message.channel.send(embed
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**Punishment options are:**` + x + 'mute, kick, ban' + x))
            }
        }


    }
}
