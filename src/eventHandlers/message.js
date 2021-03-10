const { processArguments, msToTime, missingPermissions, log, getCooldown } = require("../utils/utils")
const { Collection } = require("discord.js")
const Discord = require('discord.js')

const { devs, someServersOnly } = require('../../config/config.json')
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const afkSchema = require('../../schemas/afkschema')
const Levels = require('discord-xp')
const moment = require('moment')

const usersMap = new Map()

module.exports = async (client, message) => {
    try {

        if (
            message.author.bot ||
            message.channel.type !== 'text' ||
            client.BlacklistCache.has(message.author.id) ||
            message.webhookID ||
            !message.guild.me.permissions.has('SEND_MESSAGES')) return;

        let guildInfo = client.guildInfoCache.get(message.guild.id)
        if (!guildInfo) {
            guildInfo = await client.DBGuild.findByIdAndUpdate(message.guild.id, {}, { new: true, upsert: true, setDefaultsOnInsert: true });
            delete guildInfo._id

            client.guildInfoCache.set(message.guild.id, guildInfo)
        }
        let guildSettings = client.guildSettingsCache.get(message.guild.id)

        if (!guildSettings) {
            guildSettings = await client.DBSettings.findByIdAndUpdate(message.guild.id, {}, { new: true, upsert: true, setDefaultsOnInsert: true })
            delete guildSettings._id

            client.guildSettingsCache.set(message.guild.id, guildSettings)
        }

        let guildAudit = client.guildAuditCache.get(message.guild.id)

        if (!guildAudit) {
            guildAudit = await client.DBAudit.findByIdAndUpdate(message.guild.id, {}, { new: true, upsert: true, setDefaultsOnInsert: true })
            delete guildAudit._id

            client.guildAuditCache.set(message.guild.id, guildAudit)
        }

        let guildLevels = client.guildLevelsCache.get(message.guild.id)

        if (!guildLevels) {
            guildLevels = await client.DBLevels.findByIdAndUpdate(message.guild.id, {}, { new: true, upsert: true, setDefaultsOnInsert: true })
            delete guildLevels._id

            client.guildLevelsCache.set(message.guild.id, guildLevels)
        }
        // console.log(guildLevels.roleMultiplier)

        if (!message.member.permissions.has('ADMINISTRATOR')) {
            if (guildInfo.disabledWords === undefined) return;

            if (guildInfo.disabledWords.some((a) => message.content.toLowerCase().includes(a))) {

                message.channel.send(new Discord.MessageEmbed()
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**That word is blacklisted here**`))
                    .then(msg => { msg.delete({ timeout: 5000 }) });

                message.delete().catch((e) => { return })
            }
        }

        let guildId = message.guild.id
        let userId = message.member.id

        const fetch = await client.DBHighlight.findOne({
            guildId,
        })


        if (fetch) {
            if (fetch.guildId !== message.guild.id) return;

            if (fetch.highlightedWords.some((a) => message.content.toLowerCase().includes(a))) {


                let user = message.guild.members.cache.get(fetch.userId)

                if (user) {
                    if (userId !== fetch.userId) {

                        if (user.lastMessage !== null) {
                            if (user.lastMessage.createdTimestamp + (1000 * 60 * 3) <= Date.now()) {

                                user.send(new Discord.MessageEmbed()
                                    .setColor('GREEN')
                                    .setAuthor(`A Highlighted Phrase Was Used`, message.author.displayAvatarURL())
                                    .addField(`${message.author.username} Sent`, `\`${message.content}\``)
                                    .addField(`Message Was Sent In`, `[Jump To Message](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}) **|** ${message.channel}`,)
                                    .setFooter(`Author Id: ${message.author.id}`)
                                    .setTimestamp())
                            }
                        }
                    }
                }
            }
        }

        if (message.mentions.members.first()) {
            let results = await afkSchema.find({
                guildId,
            })

            if (results) {
                for (let i = 0; i < results.length; i++) {
                    let { userId, afk, timestamp } = results[i]
                    if (message.mentions.members.first().id === message.author.id) return;

                    if (message.mentions.members.first().id === userId) {
                        let user = message.guild.members.cache.get(userId)

                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor(message.guild.me.displayColor)
                            .setAuthor(`${user.user.username} Is AFK`, user.user.displayAvatarURL())
                            .setDescription(`\`${afk}\``)
                            .setFooter(`${moment(timestamp).fromNow()}`))
                    }
                }
            }
        }

        let afkResults = await afkSchema.find({
            guildId
        })
        if (afkResults) {
            for (let i = 0; i < afkResults.length; i++) {
                let { userId, timestamp, username } = afkResults[i]

                if (timestamp + (1000 * 10) <= new Date().getTime()) {

                    if (message.author.id === userId) {
                        await afkSchema.findOneAndDelete({
                            guildId,
                            userId
                        })


                        message.member.setNickname(`${username}`).catch((e) => {
                            console.log('No Permissions')
                        })

                        return message.channel.send(new Discord.MessageEmbed()
                            .setColor(message.guild.me.displayColor)
                            .setDescription(`**Welcome back, I removed your afk**`))
                    }
                }
            }
        }


        //Levels
        const user = await Levels.fetch(message.author.id, message.guild.id);
        let guildMultiplier = guildLevels.guildMultiplier === undefined ? 0 : guildLevels.guildMultiplier
        const generalMultipler = 1 +
            Object.entries(guildLevels.roleMultiplier || {}).reduce((acc, cur) => acc + (message.member.roles.cache.has(cur[0]) ? parseFloat(cur[1]) : 0), 0) +
            Object.entries(guildLevels.channelMultiplier || {}).reduce((acc, cur) => acc + (message.channel.id === cur[0] ? parseFloat(cur[1]) : 0), 0) +
            guildMultiplier

        let randomAmountOfXp = Math.floor(Math.random() * 3) + 1 + (generalMultipler)
        for (let i = 0; i < guildLevels.blacklistedRoles.length; i++) {
            if (message.member.roles.cache.has(guildLevels.blacklistedRoles[i])) {
                randomAmountOfXp = 0
            }
        }
        for (let i = 0; i < guildLevels.blacklistedChannels.length; i++) {
            if (message.channel.id === guildLevels.blacklistedChannels[i]) {
                randomAmountOfXp = 0
            }
        }

        if (user.lastUpdated + (1000 * 5) <= new Date().getTime() || user === false) {
            const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);

            if (hasLeveledUp) {
                let roleLevel = guildLevels.roleLevel
                if (roleLevel) {
                    let roleIds = []
                    let levels = []
                    for (const [role, level] of Object.entries(roleLevel)) {
                        roleIds.push(role)
                        levels.push(level)
                    }

                    for (let i = 0; i < roleIds.length; i++) {
                        if (user.level + 1 === Number(levels[i])) {
                            let role = message.guild.roles.cache.get(roleIds[i])
                            if (role.deleted) return;
                            message.member.roles.add(role)
                        }
                    }
                }

                if (guildLevels.levelUp === true) {
                    if (guildLevels.levelUpType !== 'DM') {
                        let channel = message.guild.channels.cache.get(guildLevels.levelUpType)
                        if (!channel) {
                            channel = message.channel
                        }

                        let ping = ``

                        if (guildLevels.levelUpPings === true) {
                            ping = `${message.author}`
                        }
                        channel.send(ping, {
                            embed: {
                                author: {
                                    name: `Congrats ${message.author.username}!`,
                                    iconURL: message.author.displayAvatarURL()
                                },
                                color: message.guild.me.displayColor,
                                description: `You have leveled up to **${user.level + 1}**`,
                                thumbnail: {
                                    url: message.guild.iconURL()
                                }
                            },
                        })

                    } else if (guildLevels.levelUpType === 'DM') {

                        message.author.send(new Discord.MessageEmbed()
                            .setAuthor(`Congrats ${message.author.username}!`, message.author.displayAvatarURL())
                            .setColor(message.guild.me.displayColor)
                            .setDescription(`You have leveled up to **${user.level + 1}**`)
                            .setThumbnail(message.guild.iconURL()))
                    }
                }
            }
        }

        let antiSpam = guildSettings.antiSpam
        let antiSpamAmount = guildSettings.antiSpamAmount
        let antiSpamTimeout = guildSettings.antiSpamTimeout

        if (antiSpam) {
            let antiSpamEmbed = new Discord.MessageEmbed()
            if (usersMap.has(message.author.id)) {
                const userData = usersMap.get(message.author.id)
                const { lastMessage, timer } = userData;
                const difference = message.createdTimestamp - lastMessage.createdTimestamp;

                let msgCount = userData.msgCount
                if (difference > 2500) {
                    clearTimeout(timer)
                    userData.msgCount = 1
                    userData.lastMessage = message

                    userData.timer = setTimeout(() => {
                        usersMap.delete(message.author.id);
                    }, antiSpamAmount)

                    usersMap.set(message.author.id, userData)
                } else {
                    ++msgCount
                    if (parseInt(msgCount) === antiSpamAmount) {
                        let role = message.guild.roles.cache.get(guildInfo.mutedRole)
                        if (!role) message.channel.send(antiSpamEmbed
                            .setColor(message.guild.me.displayColor)
                            .setDescription(`**There is no muted role set in this server`))


                        message.member.roles.add(role).catch((e) => {
                            message.channel.send(antiSpamEmbed
                                .setColor(message.guild.me.displayColor)
                                .setDescription('```' + e + '```')
                                .setFooter(`If this error occurs again, please inform Qzxy#4227`))
                            return
                        })
                        setTimeout(() => {
                            message.member.roles.remove(role).catch((e) => {
                                message.channel.send(antiSpamEmbed
                                    .setColor(message.guild.me.displayColor)
                                    .setDescription('```' + e + '```')
                                    .setFooter(`If this error occurs again, please inform Qzxy#4227`))
                                return
                            })
                        }, antiSpamTimeout)

                        message.channel.send(antiSpamEmbed.setColor(message.guild.me.displayColor).setDescription(`**You have been muted for sending messages too quickly**`))
                    } else {
                        userData.msgCount = msgCount
                        usersMap.set(message.author.id, userData)
                    }
                }

            } else {
                let fn = setTimeout(() => {
                    usersMap.delete(message.author.id);
                }, antiSpamTimeout);

                usersMap.set(message.author.id, {
                    msgCount: 1,
                    lastMessage: message,
                    timer: fn
                })
            }
        }


        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(guildInfo.prefix)})\\s*`);
        if (!prefixRegex.test(message.content)) return;

        const [, matchedPrefix] = message.content.match(prefixRegex);
        let msgargs = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        let cmdName = msgargs.shift().toLowerCase();

        const mypf = new Discord.MessageEmbed()

        if (message.mentions.has(client.user) && !cmdName) return message.channel.send(mypf.setColor(message.guild.me.displayColor).setDescription(`My prefix is \`${guildInfo.prefix}\` or ${client.user}\nTo view a list of my commands, type \`${guildInfo.prefix}help\``))

        const command = client.commands.get(cmdName) || (guildInfo.commandAlias ? client.commands.get(guildInfo.commandAlias[cmdName]) : false)

        if (!command) return;

        if (command.devOnly && !devs.includes(message.author.id)) return;
        if (command.someServersOnly && !someServersOnly.includes(message.guild.id)) return;
        if (command.someServers && !command.someServers.includes(message.guild.id)) return;
        if (command.serverOwnerOnly && message.guild.ownerID !== message.author.id) return;
        if (command.nsfwOnly && !message.channel.nsfw) {
            return message.channel.send(new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setDescription(`**This command can only be used in \`nsfw\` channels**`))
        }

        if (guildInfo.disabledCommands.includes(command.name)) return;

        if (guildInfo.disabledChannels.includes(message.channel.id) && !command.ignoreDisabledChannels) {
            if (!message.member.hasPermission('MANAGE_GUILD')) return
        }

        if (command.clientPerms && !message.channel.permissionsFor(message.guild.me).has(command.clientPerms)) {
            return message.channel.send(mypf.setColor(message.guild.me.displayColor).setDescription(`**${message.author.username}, I am missing the following permissions: ${missingPermissions(message.guild.me, command.clientPerms)}**`)).catch()
        }

        const PERMS = new Discord.MessageEmbed()

        if (guildInfo.commandPerms && guildInfo.commandPerms[command.name] && !message.member.permissions.has(guildInfo.commandPerms[command.name]) && message.author.id !== '751606134938402866') {
            return message.channel.send(PERMS
                .setColor(message.guild.me.displayColor)
                .setDescription(`**${message.author.username}, you are missing the following permissions: ${missingPermissions(message.member, guildInfo.commandPerms[command.name])}**`))
        } else if (command.perms && !message.member.permissions.has(command.perms) && message.author.id !== '751606134938402866') {
            return message.channel.send(PERMS
                .setColor(message.guild.me.displayColor)
                .setDescription(`**${message.author.username}, you are missing the following permissions: ${missingPermissions(message.member, command.perms)}**`))
        }

        let cd = getCooldown(client, command, message);

        let cooldowns;

        if (cd) {
            if (typeof command.globalCooldown === 'undefined' || command.globalCooldown) {
                if (!client.globalCooldowns.has(command.name)) client.globalCooldowns.set(command.name, new Collection());
                cooldowns = client.globalCooldowns;
            } else {
                if (!client.serverCooldowns.has(message.guild.id)) client.serverCooldowns.set(message.guild.id, new Collection());
                cooldowns = client.serverCooldowns.get(message.guild.id);
                if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.name);

            const cooldownAmount = cd * 1000;
            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                const coold = new Discord.MessageEmbed()


                if (now < expirationTime) return message.channel.send(coold.setColor(message.guild.me.displayColor).setDescription(`**${message.author.username}, please wait \`${msToTime(expirationTime - now)}\` before using this command again.**`))
            }


        }

        if (command.arguments && command.arguments.length !== 0) msgargs = processArguments(message, msgargs, command.arguments)
        if (msgargs.invalid) return message.channel.send(msgargs.prompt);
        command.execute(client, message, msgargs);


    } catch (e) {
        log("ERROR", "src/eventHandlers/message.js", e.message)
    }

};