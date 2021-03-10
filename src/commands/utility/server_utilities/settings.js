const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { paginate } = require('../../../utils/utils')
let x = '```'
const ms = require('ms')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "settings",
    category: "Utility",
    aliases: ['setting'],
    canNotDisable: true,
    ignoreDisabledChannels: true,
    description: "View and change settings for your server.  Some commands have different syntax's, such as: auto role, disabling commands/channels and prefix's",
    usage: "- \`PREFIXsettings\` to display all current settings\n- \`PREFIXsettings [setting name] [disable/enable]\` to disable/enable settings.",
    clientPerms: ['MANAGE_GUILD'],

    execute: async function (client, message, args) {
        let setting = args[0]

        const settingEmbed = new Discord.MessageEmbed()

        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let prefix = guildInfo.prefix
        let commandAlias = guildInfo.commandAlias ? Object.entries(guildInfo.commandAlias) : []
        let disabledChannels = guildInfo.disabledChannels;
        let disabledCommands = guildInfo.disabledCommands;
        let mutedRole = guildInfo.mutedRole
        let timeoutRole = guildInfo.timeoutRole

        let guildSettings = client.guildSettingsCache.get(message.guild.id)

        let ghostPingSetting = guildSettings.ghostPing
        let decancerSetting = guildSettings.decancer

        let autoRoleSetting = guildSettings.autoRoleId
        let welcomeChannelSetting = guildSettings.welcomeChannelId
        let leaveChannelSetting = guildSettings.leaveChannelId
        let ignoredChannelSetting = guildSettings.ignoreChannelId
        let auditLogChannel = guildSettings.auditLogChannelId

        let antiSpam = guildSettings.antiSpam
        let antiSpamAmount = guildSettings.antiSpamAmount
        let antiSpamTimeout = guildSettings.antiSpamTimeout

        if (!setting) {
            let embeds = []
            let options = ['Main Settings', 'Ghost Pings', 'Decancer', 'Antispam', 'Welcome', 'Leave', 'Mute And Timeout Roles', 'Disable Commands', 'Disable Channels', 'Autorole', 'Audit Logs', 'Ignored Channels', 'Custom Cooldowns', 'Custom Aliases']
            let desc = ``
            for (let i = 0; i < options.length; i++) {
                desc += `\`#${i + 1}\` \`${options[i]}\`\n\n`
            }

            const firstSetting = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Settings Overview For ${message.guild.name}`)
                .setDescription(`Here is a guide to all the settings you can customize for your server \n\n${desc}`)
                .setFooter(`React with 🔢 and then type the number in front of the setting you wish to see!`)
            embeds.push(firstSetting)

            const ghostPingSettings = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Ghost Ping Setting For ${message.guild.name}`)
                .setDescription(`With ghost ping detection enabled, I will send a message in the channel letting you know that someone deleted a mention\n\n\`${prefix}settings ghostping [enable/disable]\` to enable and disable. \nOn default, its enabled\n\n**Ghost Ping Settings**` + x + `Detection: ${ghostPingSetting}` + x)
            embeds.push(ghostPingSettings)


            const decancerSettings = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Decancer Setting For ${message.guild.name}`)
                .setDescription(`With decancering enabled, I will change the nickname of any member that joins with a cancerous name\n\n\`${prefix}settings decancer [enable/disable]\` to enable and disable. \nOn default, its disabled\n\n**Decancer Settings**` + x + `Decancering: ${decancerSetting === undefined ? "Disabled" : 'Enabled'}` + x)
            embeds.push(decancerSettings)

            const antispamSettings = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Antispam Settings For ${message.guild.name}`)
                .setDescription(`With antispam enabled, I will automatically mute anyone who breaks the spam limit for the given amount of seconds\n\n\`${prefix}settings antispam [enable/disable]\` to enable and disable antispam\n\`${prefix}settings antispam amount [amount]\` to set the amount of spam that is not allowed. On default, its enabled with 5 being the spam barrier\n\n**Antispam Settings**` + x + `Antispam: ${antiSpam === undefined ? "Disabled" : 'Enabled'}\nAntispam Amount: ${antiSpamAmount}` + x)
            embeds.push(antispamSettings)

            let welcomeChannel = message.guild.channels.cache.get(welcomeChannelSetting)
            const welcomeSettings = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Welcome Setting For ${message.guild.name}`)
                .setDescription(`With welcome messages enabled, I will send a messsage to the channel you used the command in, welcoming the person with the text specified\n\n\`${prefix}setwelcome [text]\` to set the text\nOn default, its disabled. List of supported variables can be found using \`${prefix}help setwelcome\`\n\n**Welcome Settings**` + x + `Welcome Channel: ${welcomeChannelSetting === undefined ? "Disabled" : `#${welcomeChannel.name}`}\nWelcome Text: ${guildSettings.welcomeChannelText === undefined ? 'Disabled' : guildSettings.welcomeChannelText}` + x)
            embeds.push(welcomeSettings)

            let leaveChannel = message.guild.channels.cache.get(leaveChannelSetting)
            let leaveText = guildSettings.leaveChannelText
            const leaveSettings = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Leave Setting For ${message.guild.name}`)
                .setDescription(`With leave messages enabled, I will send a messsage to the channel you used the command in, notifying you that a person left with the text specified\n\n\`${prefix}setleave [text]\` to set the text\nOn default, its disabled. List of supported variables can be found using \`${prefix}help setleave\`\n\n**Leave Settings**` + x + `Leave Channel: ${leaveChannelSetting === undefined ? "Disabled" : `#${leaveChannel.name}`}\nLeave Text: ${leaveText === undefined ? 'Disabled' : leaveText}` + x)
            embeds.push(leaveSettings)

            let mutedRoles = message.guild.roles.cache.get(mutedRole)
            let timeoutRoles = message.guild.roles.cache.get(timeoutRole)
            const roleSettings = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Role Settings For ${message.guild.name}`)
                .setDescription(`You can set custom roles for your members to get when they are muted and timed out (time out is similar to mute)\n\n\`${prefix}set\` to view the current roles\n\`${prefix}set [mute/timeout] [role] [set/remove]\` to set and remove a role from the settings. On default, both roles are disabled\n\n**Role Settings**` + x + `Mute Role: ${mutedRole === undefined ? "Disabled" : `${mutedRoles.name}`}\nTime-out Role: ${timeoutRole === undefined ? 'Disabled' : `${timeoutRoles.name}`}` + x)
            embeds.push(roleSettings)

            const commandsSettings = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Command Settings For ${message.guild.name}`)
                .setDescription(`You can disable and enable commands so that they cannot be used in the server by anyone\n\n\`${prefix}commands\` to view the currently disabled commands\n\`${prefix}commands [command] [disable/enable]\` to disable and enable a command. On default, no commands are disabled\n\n**Disabled Commands**` + x + `Commands: ${disabledCommands.length === 0 ? 'None!' : '' + disabledCommands.join(', ') + ''}` + x)
            embeds.push(commandsSettings)

            let disabledChannelNames = []
            for (let i = 0; i < disabledChannels.length; i++) {
                let chan = message.guild.channels.cache.get(disabledChannels[i])
                disabledChannelNames.push(chan === undefined ? 'Deleted Channel!' : chan.name)
            }
            const channelSettings = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Channel Settings For ${message.guild.name}`)
                .setDescription(`You can disable and enable channels so that they commands cannot be used in that channel by anyone that doesn't have \`manage server\` permissions\n\n\`${prefix}channels\` to view the currently disabled channels\n\`${prefix}channel [#channel] [disable/enable]\` to disable and enable a channel. On default, no channels are disabled\n\n**Disabled Channels**` + x + `Channels: \n${disabledChannels.length === 0 ? 'None!' : '' + disabledChannelNames.join('\n') + ''}` + x)
            embeds.push(channelSettings)

            let autorole = message.guild.roles.cache.get(autoRoleSetting)
            const autoRoleSettings = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Auto Role Setting For ${message.guild.name}`)
                .setDescription(`You can set and remove a role to be given to members that join the server\n\n\`${prefix}autorole\` to view the current autoroles\n\`${prefix}autorole [role] [set/remove]\` to set and remove a role. On default, no roles will be given\n\n**Autorole Settings**` + x + `Autorole: ${autoRoleSetting === undefined ? 'None' : `${autorole.name}`}` + x)
            embeds.push(autoRoleSettings)

            let auditLog = message.guild.channels.cache.get(auditLogChannel)
            const auditLogSettings = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Audit Log Setting For ${message.guild.name}`)
                .setDescription(`You can set and remove a channel for all audit logs to be sent to, so you can keep track of everything that goes on in your server!\n\n\`${prefix}log\` to view the current audit log channel\n\`${prefix}log [#channel] [set/remove]\` to set and remove the channel. On default, there is no audit log\n\n**Audit Log Settings**` + x + `Audit Log Channel: ${auditLogChannel === undefined ? 'None' : `${auditLog.name}`}` + x)
            embeds.push(auditLogSettings)

            let ignoredChannelNames = []
            for (let i = 0; i < ignoredChannelSetting.length; i++) {
                let chan = message.guild.channels.cache.get(ignoredChannelSetting[i])
                ignoredChannelNames.push(chan.name)
            }
            const ignoreChannelSettings = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Ignored Channel Settings For ${message.guild.name}`)
                .setDescription(`You can set and remove channels so that when the \`lockdown\` command is used, the permissions for that channel will be ignored\n\n\`${prefix}atig\` to view the currently ignored channels\n\`${prefix}atig [#channel] [set/remove]\` to set and remove an ignored channel. On default, no channels are ignored, so its reccomended you do so\n\n**Ignored Channels**` + x + `Channels: ${ignoredChannelSetting.length === 0 ? 'None!' : '\n' + ignoredChannelNames.join('\n') + ''}` + x)
            embeds.push(ignoreChannelSettings)

            const cooldownSettings = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Cooldown Settings For ${message.guild.name}`)
                .setDescription(`You can set and remove cooldowns from commands so that whenever that command is used, members with that role will have a different cooldown\n\n\`${prefix}cooldowns [command]\` to view the cooldown for that command\n\`${prefix}cooldowns [command] set [role] [cooldown]\` to set a cooldown for that role\n\`${prefix}cooldowns [command] clear [role]\` to clear the cooldowns for that role. On default, command cooldowns are applied to everyone\n\n**Command Cooldowns**` + x + `Not Viewable On Settings Page` + x)
            embeds.push(cooldownSettings)

            let commands = new Discord.Collection();
            for ([alias, command] of commandAlias) {
                let aliases = commands.get(command)
                if (!aliases || aliases[1].length === 0) aliases = [command, [alias]]
                else aliases[1].push(alias)

                commands.set(command, aliases)
            }

            let text = ""
            for (const a of commands.array()) {
                text += `${a[0]} | ${a[1].join(', ')}\n`
            }
            const aliasSettings = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Custom Alias Settings For ${message.guild.name}`)
                .setDescription(`You can set and remove custom aliases for a command to make using some commands easier\n\n\`${prefix}alias\` to view all custom aliases in the server\n\`${prefix}alias [set/remove] [new alias] [command]\` to set and remove the custom alias from that command. On default, no custom aliases exist\n\n**Custom Aliases**` + x + `${commandAlias.length === 0 ? 'None' : text}` + x)
            embeds.push(aliasSettings)



            return paginate(message, embeds, { time: 1000 * 30 })
        }

        if (!message.member.permissions.has('MANAGE_GUILD')) return message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription('**You need to have `manage server` permissions to change server settings**'))

        if (setting.toLowerCase() === 'ghostping') {
            switch (args[1]) {
                case 'enable':
                    if (ghostPingSetting === 'Enabled') return message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**Ghost ping detection is already enabled**`))

                    await client.DBSettings.findByIdAndUpdate(message.guild.id, { $set: { ghostPing: 'Enabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildSettings.ghostPingSetting = 'Enabled'
                    client.guildSettingsCache.set(message.guild.id, guildSettings)

                    message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**Ghost ping detection is now set to true**`))

                    break;
                case 'disable':
                    if (ghostPingSetting === 'Disabled') return message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**Ghost ping detection is already disabled**`))

                    await client.DBSettings.findByIdAndUpdate(message.guild.id, { $set: { ghostPing: 'Disabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildSettings.ghostPingSetting = 'Disabled'
                    client.guildSettingsCache.set(message.guild.id, guildSettings)

                    message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**Ghost ping detection is now set to false**`))

                    break;
                default:
                    message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        } else if (setting.toLowerCase() === 'decancer') {
            switch (args[1]) {
                case 'enable':
                    if (decancerSetting === true) return message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**Decancering is already enabled**`))

                    await client.DBSettings.findByIdAndUpdate(message.guild.id, { $set: { decancer: true } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildSettings.decancerSetting = true
                    client.guildSettingsCache.set(message.guild.id, guildSettings)

                    message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**Decancering is now enabled**`))

                    break;
                case 'disable':
                    if (decancerSetting === undefined) return message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**Decancering is already disabled**`))

                    guildSettings = await client.DBSettings.findByIdAndUpdate(message.guild.id, { $unset: { decancer: false } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    client.guildSettingsCache.set(message.guild.id, guildSettings)

                    message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**Decancering is now disabled**`))

                    break;
                default:
                    message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        } else if (setting.toLowerCase() === 'antispam') {
            let choice = args[1]

            if (choice.toLowerCase() === 'enable') {
                if (antiSpam === true) return message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**Antispam is already enabled**`))

                await client.DBSettings.findByIdAndUpdate(message.guild.id, { $set: { antiSpam: true } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                guildSettings.antiSpam = true
                client.guildSettingsCache.set(message.guild.id, guildSettings)

                return message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**Antispam is now enabled**`))
            } else if (choice.toLowerCase() === 'disable') {
                if (antiSpam === undefined) return message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**Antispam is already disabled**`))

                guildSettings = await client.DBSettings.findByIdAndUpdate(message.guild.id, { $unset: { antiSpam: false } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                client.guildSettingsCache.set(message.guild.id, guildSettings)

                message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**Antispam is now disabled**`))
            } else if (choice.toLowerCase() === 'amount') {
                let amount = args[2]
                if (isNaN(amount) || amount < 1) return message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**Please choose a number that is greater than 1**`))

                await client.DBSettings.findByIdAndUpdate(message.guild.id, { $set: { antiSpamAmount: parseInt(amount) } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                guildSettings.antiSpamAmount = parseInt(amount)
                client.guildSettingsCache.set(message.guild.id, guildSettings)

                return message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**The amount of accepted spam is now ${parseInt(amount) - 1} before a user will be muted**`))
            } else {
                return message.channel.send(`**${message.author} please check the usage of this command`)
            }


        }

    }
}
