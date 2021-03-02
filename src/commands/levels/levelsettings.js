const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const Levels = require('discord-xp')
const { paginate } = require('../../utils/utils')


/**
 * @type {import('../../typings.d').Command}
 */

module.exports = {
    name: "levelsettings",
    category: "Levels",
    aliases: ["lvlsettings", 'xpsettings', 'lvls'],
    description: "Display the XP multiplier to the specified role",
    usage: "- \`PREFIXlevelsettings\` to view the current level settings for the server",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {

        let guildLevels = client.guildLevelsCache.get(message.guild.id)
        let guildInfo = client.guildInfoCache.get(message.guild.id)

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
                roleDesc += `\`${multiplier}\` | <@&${role}>\n`
            }
        }

        let channelDesc = ''
        if (channelMultiplier) {
            for (const [channel, multiplier] of Object.entries(channelMultiplier)) {
                channelDesc += `\`${multiplier}\` | <#${channel}>\n`
            }
        }

        let levelDesc = ''
        if (roleLevel) {
            for (const [role, level] of Object.entries(roleLevel)) {
                levelDesc += `\`${level}\` | <@&${role}>\n`
            }
        }

        const embed1 = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setAuthor(`Level Settings Overview For ${message.guild.name}`)
            .setThumbnail(message.guild.iconURL())
            .addField(`__Turn level up messages on and off__`, `No notifications will be set (used with \`levelup\` command)`)
            .addField(`__Choose where your level up messages are sent__`, `You can customize it to a channel/dm (used with \`levelup\` command)`)
            .addField(`__You can disable pings__`, `Members wont be ping when they level up (used with \`levelup\` command)`)
            .addField(`__Customize, guild, role, and channel multipliers__`, `Each message gains a litte more XP (used with \`gmulti\`, \`rmulti\` and \`cmulti\` commands)`)
            .addField(`__Blacklist roles and channels__`, `To prevent them from gaining XP (used with \`brole\` and \`bchannel\` command)`)
            .addField(`__Add roles to be gained at a level__`, `To automatically give your users roles once they reach a level (used with \`rolelevel\``)
            .setDescription(`Here is a guide to all the level settings you can customize for your server`)
            .setFooter(`Prefix: ${guildInfo.prefix}`, message.author.displayAvatarURL())
            .setTimestamp()

        let embed2 = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setAuthor(`Level Up Settings For ${message.guild.name}`)
            .addField(`Level Up Notifications`, `${levelUpNotifs === undefined ? '\`Disabled\`' : '\`Enabled\`'}`)
            .addField(`Level Up Display`, levelUpDisplay === undefined ? '\`Off\`' : levelUpDisplay === 'DM' ? `\`DM\`` : `<#${guildLevels.levelUpType}>`)
            .addField(`Level Up Pings`, `${levelUpPings === undefined ? '\`Off\`' : '\`On\`'}`)
            .setThumbnail(message.guild.iconURL())
            .setFooter(`Prefix: ${guildInfo.prefix}`, message.author.displayAvatarURL())
            .setTimestamp()

        let embed3 = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setAuthor(`Level Multiplier Settings For ${message.guild.name}`)
            .addField(`Guild Multiplier`, guildMultiplier === undefined ? `\`None!\`` : `\`${guildMultiplier}\``)
            .addField(`Role Multipliers`, roleDesc === '' ? '\`None!\`' : `${roleDesc}`)
            .addField(`Channel Multipliers`, channelDesc === '' ? '`None!`' : `${channelDesc}`)
            .addField(`Role Levels`, levelDesc === '' ? '`None!`' : `${levelDesc}`)
            .setThumbnail(message.guild.iconURL())
            .setFooter(`Prefix: ${guildInfo.prefix}`, message.author.displayAvatarURL())
            .setTimestamp()

        let embed4 = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setAuthor(`Blacklisted Level Settings For ${message.guild.name}`)
            .addField(`Blacklisted Roles`, blacklistedRoles.length === 0 ? '\`None!\`' : '<@&' + blacklistedRoles.join('>\n<@&') + '>')
            .addField(`Blacklisted Channels`, blacklistedChannels.length === 0 ? '\`None!\`' : '<#' + blacklistedChannels.join('>\n<#') + '>')
            .setThumbnail(message.guild.iconURL())
            .setFooter(`Prefix: ${guildInfo.prefix}`, message.author.displayAvatarURL())
            .setTimestamp()



        paginate(message, [embed1, embed2, embed3, embed4], { time: 1000 * 30 })
    }
}