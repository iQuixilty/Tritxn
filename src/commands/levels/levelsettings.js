const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../utils/utils')
const { paginate } = require('../../utils/utils')
let x = '```'

/**
 * @type {import('../../typings.d').Command}
 */

module.exports = {
    name: "levelsettings",
    category: "Levels",
    aliases: ["lvlsettings", 'xpsettings', 'lvls'],
    description: "Display the XP multiplier to the specified role",
    usage: "- \`PREFIXlevelsettings\` to view the current level settings for the server",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let guildLevels = client.guildLevelsCache.get(message.guild.id)
        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let prefix = guildInfo.prefix

        let levelUpNotifs = guildLevels.levelUp
        let levelUpDisplay = guildLevels.levelUpType
        let levelUpPings = guildLevels.levelUpPings

        let roleMultiplier = guildLevels.roleMultiplier || {}
        let channelMultiplier = guildLevels.channelMultiplier || {}

        let blacklistedRoles = guildLevels.blacklistedRoles
        let blacklistedChannels = guildLevels.blacklistedChannels

        let guildMultiplier = guildLevels.guildMultiplier;

        let roleLevel = guildLevels.roleLevel

        let roleDesc = ''
        if (roleMultiplier) {
            for (const [role, multiplier] of Object.entries(roleMultiplier)) {
                let Role = message.guild.roles.cache.get(role)
                roleDesc += `${multiplier} | ${Role.name}\n`
            }
        }

        let channelDesc = ''
        if (channelMultiplier) {
            for (const [channel, multiplier] of Object.entries(channelMultiplier)) {
                let Channel = message.guild.channels.cache.get(channel)
                channelDesc += `${multiplier} | ${Channel.name}\n`
            }
        }

        let levelDesc = ''
        if (roleLevel) {
            for (const [role, level] of Object.entries(roleLevel)) {
                let Role = message.guild.roles.cache.get(role)
                levelDesc += `${level} | ${Role.name}\n`
            }
        }

        let embeds = []
        let options = ['Main Settings', 'Level Up', 'Guild Multiplier', 'Role Multiplier', 'Channel Multiplier', 'Blacklist Roles', 'Blacklist Channels', 'Role Levels']
        let settingdesc = ``
        for (let i = 0; i < options.length; i++) {
            settingdesc += `\`#${i + 1}\` \`${options[i]}\`\n\n`
        }


        const firstSetting = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setAuthor(`Level Settings Overview For ${message.guild.name}`)
            .setDescription(`Here is a guide to all the settings you can customize for your server \n\n${settingdesc}`)
            .setFooter(`React with 🔢 and then type the number in front of the setting you wish to see!`)
        embeds.push(firstSetting)

        let lvlupchannel = message.guild.channels.cache.get(guildLevels.levelUpType)
        const lvlupSettings = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setAuthor(`Level Up Settings For ${message.guild.name}`)
            .setDescription(`Customize your servers level up settings so that you can disable level up messages, choose where to send the level up message, and enable/disable pings\n\n\`${prefix}levelup\` to view the current level up settings\n\`${prefix}levelup [notifs] [true/false]\` to change whether you want notifications or not\n\`${prefix}levelup [ping] [true/false]\` to change whether you want members to be pinged when level up or not\n\`${prefix}levelup type [DM | #channel | off]\` to choose where you want level up messages to go, if \`off\` is used, it will send the message to the channel the member leveled up in.\nOn default, notifications will ping the member in the channel they leveled up in\n\n**Level Up Settings**` + x + `Level Up Notifications: ${levelUpNotifs === undefined ? 'Disabled' : 'Enabled'}\nLevel Up Display: ${levelUpDisplay === undefined ? 'Off' : levelUpDisplay === 'DM' ? `DM` : `${lvlupchannel.name}`}\nLevel Up Pings: ${levelUpPings === undefined ? 'Off' : 'On'}` + x)
        embeds.push(lvlupSettings)

        const gmultiSettings = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setAuthor(`Guild Multiplier Settings For ${message.guild.name}`)
            .setDescription(`Customize your guild multiplier for your server so that each message gains that much more XP\n\n\`${prefix}gmulti\` to view the current guild multiplier\n\`${prefix}gmulti [amount] [set/remove]\` to change the guild multi for your server. By default, the guild multiplier is 1\n\n**Guild Multipler Settings**` + x + `Guild Multipler: ${guildMultiplier === undefined ? `None!` : `${guildMultiplier}`}` + x)
        embeds.push(gmultiSettings)

        const rmultiSettings = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setAuthor(`Role Multiplier Settings For ${message.guild.name}`)
            .setDescription(`Customize the role multipliers for your server so that members with that role gain that much more XP\n\n\`${prefix}rmulti\` to view the current role multipliers\n\`${prefix}rmulti set [role] [amount]\` to set the multiplier for a role\n\`${prefix}rmulti clear [role]\` to clear the multipler for that role. By default, there are no role multipliers\n\n**Role Multipler Settings**` + x + `Role Multiplers: ${roleDesc === '' ? 'None!' : `\n${roleDesc}`}` + x)
        embeds.push(rmultiSettings)

        const cmultiSettings = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setAuthor(`Channel Multiplier Settings For ${message.guild.name}`)
            .setDescription(`Customize the channel multipliers for your server so that messages send in that channel gain that much more XP\n\n\`${prefix}gmulti\` to view the current channel multipliers\n\`${prefix}cmulti set [#channel] [amount]\` to set the multiplier for a channel\n\`${prefix}cmulti clear [#channel]\` to clear the multipler for that channel. By default, there are no channel multipliers\n\n**Channel Multipler Settings**` + x + `Channel Multiplers: ${channelDesc === '' ? 'None!' : `\n${channelDesc}`}` + x)
        embeds.push(cmultiSettings)

        const rlevelSettings = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setAuthor(`Role Level Settings For ${message.guild.name}`)
            .setDescription(`Customize what roles your members get when they reach a specific level\n\n\`${prefix}rlevel\` to view the current level roles\n\`${prefix}rlevel set [role] [level]\` to set the role to gain at that level\n\`${prefix}rlevel clear [role]\` to clear the role for that level. By default, there are no level roles\n\n**Role Level Settings**` + x + `Role Levels: ${levelDesc === '' ? 'None!' : `\n${levelDesc}`}` + x)
        embeds.push(rlevelSettings)


        let blChannelNames = []
        for (let i = 0; i < blacklistedChannels.length; i++) {
            let chan = message.guild.channels.cache.get(blacklistedChannels[i])
            blChannelNames.push(chan === undefined ? 'Deleted Channel!' : chan.name)
        }
        const blchannelSettings = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setAuthor(`Blacklisted Channel Settings For ${message.guild.name}`)
            .setDescription(`You can blacklist and whitelist channels so that messages send in that channel will not gain any XP\n\n\`${prefix}bchan\` to view the currently blacklisted channels\n\`${prefix}bchan [#channel] [blacklist/whitelist]\` to blacklist and whitelist a channel. On default, no channels are blacklisted\n\n**Blacklisted Channels**` + x + `Channels: \n${blacklistedChannels.length === 0 ? 'None!' : '' + blChannelNames.join('\n') + ''}` + x)
        embeds.push(blchannelSettings)

        let blRoleNames = []
        for (let i = 0; i < blacklistedRoles.length; i++) {
            let role = message.guild.roles.cache.get(blacklistedRoles[i])
            blRoleNames.push(role === undefined ? 'Deleted Role!' : role.name)
        }
        const blroleSettings = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setAuthor(`Blacklisted Role Settings For ${message.guild.name}`)
            .setDescription(`You can blacklist and whitelist role so that members with the blacklisted role will not gain any XP\n\n\`${prefix}brole\` to view the currently blacklisted roles\n\`${prefix}brole [role] [blacklist/whitelist]\` to blacklist and whitelist a role. On default, no roles are blacklisted\n\n**Blacklisted Roles**` + x + `Roles: \n${blacklistedRoles.length === 0 ? 'None!' : '' + blRoleNames.join('\n') + ''}` + x)
        embeds.push(blroleSettings)

        paginate(message, embeds, { time: 1000 * 30 })
    }
}