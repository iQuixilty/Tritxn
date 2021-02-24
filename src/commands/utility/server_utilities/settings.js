const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { paginate } = require('../../../utils/utils')

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

        if (!setting) {
            const mainSetting = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Settings Overview For ${message.guild.name}`)
                .setDescription(`Here is a guide to all the settings you can customize for your server \n\n**You can**: \n\n-\`Track ghost pings\` allowing you to see if members are ghost pinging (used with \`setting\` command) \n\n-\`Decancer usernames\` when a member with a cancerous name joins the server (used with \`setting\` command) \n\n-\`Set welcome and leave messages\` when members join and leave (used with \`setw\`, \`setl\` commands)\n\n-\`Customize mute/timeout roles\` so you can mute and timeout when any role (used with \`set\` command)\n\n-\`Disable commands and channels\` so users are limited to where they can use commands (used with \`commands\`, \`channels\` commands) \n\n-\`Set an autorole\` for new members to get when they join (used with \`autorole\` command) \n\n-\`Set an audit log channel\` to see everything that goes on in your server (used with \`log\` command) \n\n-\`Set ignored channels\` in case of a lockdown and you don't want permissions to be messed up (used with \`atig\` command) \n\n-\`Set custom cooldowns\` for roles and commands (used with \`cooldowns\` command)\n\n-\`Set custom aliases\` to make using commands easier (used with \`alias\` command)`)
                .setFooter(`Prefix: ${guildInfo.prefix}`, message.author.displayAvatarURL())
                .setTimestamp()

            const channelSettings = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Channel Settings For ${message.guild.name}`)
                .addField(`Disabled Channels`, disabledChannels.length === 0 ? 'None!' : '<#' + disabledChannels.join('>\n <#') + '>')
                .addField(`Welcome Channel`, welcomeChannelSetting === undefined ? 'None!' : `<#${welcomeChannelSetting}>`)
                .addField(`Leave Channel`, leaveChannelSetting === undefined ? 'None!' : `<#${leaveChannelSetting}>`)
                .addField(`Ignored Channels`, ignoredChannelSetting.length === 0 ? 'None!' : ignoredChannelSetting.length > 3 ? 'Too Many!' : '<#' + ignoredChannelSetting.join('>, <#') + '>')
                .addField(`Audit Log Channel`, auditLogChannel === undefined ? 'None!' : auditLogChannel === 'Disabled' ? 'None!' : '<#' + auditLogChannel + '>')
                .setFooter(`Prefix: ${guildInfo.prefix}`, message.author.displayAvatarURL())
                .setTimestamp()

            const roleSettings = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Role Settings For ${message.guild.name}`)
                .addField(`Muted Role`, mutedRole === undefined ? 'None!' : `${message.guild.roles.cache.get(mutedRole)}`)
                .addField(`Time Out Role`, timeoutRole === undefined ? 'None!' : `${message.guild.roles.cache.get(timeoutRole)}`)
                .addField(`Autorole`, autoRoleSetting === undefined ? 'None!' : `<@&${autoRoleSetting}>`)
                .setFooter(`Prefix: ${guildInfo.prefix}`, message.author.displayAvatarURL())
                .setTimestamp()

            const miscSettings = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(`Other Settings For ${message.guild.name}`)
                .addField(`Ghost Pings`, `${ghostPingSetting}`)
                .addField(`Auto Decancer`, `${decancerSetting}`)
                .addField(`Disabled Commands`, disabledCommands.length === 0 ? 'None!' : '\`' + disabledCommands.join('\`\n \`') + '\`')
                .setFooter(`Prefix: ${guildInfo.prefix}`, message.author.displayAvatarURL())
                .setTimestamp()

            return paginate(message, [mainSetting, channelSettings, roleSettings, miscSettings])
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
                    if (decancerSetting === 'Enabled') return message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**Decancering is already enabled**`))

                    await client.DBSettings.findByIdAndUpdate(message.guild.id, { $set: { decancer: 'Enabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildSettings.decancerSetting = 'Enabled'
                    client.guildSettingsCache.set(message.guild.id, guildSettings)

                    message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**Decancering is now set to true**`))

                    break;
                case 'disable':
                    if (decancerSetting === 'Disabled') return message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**Decancering is already disabled**`))

                    await client.DBSettings.findByIdAndUpdate(message.guild.id, { $set: { decancer: 'Disabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildSettings.decancerSetting = 'Disabled'
                    client.guildSettingsCache.set(message.guild.id, guildSettings)

                    message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**Decancering is now set to false**`))

                    break;
                default:
                    message.channel.send(settingEmbed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        }
    }
}
