const Discord = require('discord.js')
const PREFIX = require('../../config/config.json').PREFIX;
const { getGuildInfo, getGuildAudit, getGuildLevels, getGuildSettings } = require("../utils/utils")

module.exports = async (client, guild, user) => {
    unbannedMember(client, guild, user)
}

let unbannedMember = async (client, guild, user) => {
    const result = await getGuildSettings(client, guild.id)

    let guildAudit = await getGuildAudit(client, guild.id)

    let auditLogChannel = result.auditLogChannelId

    if (auditLogChannel === undefined) return;
    if (guildAudit.guildBanRemove === undefined || guildAudit.guildBanRemove === 'Disabled') return;

    const channel = client.channels.cache.get(auditLogChannel)

    const auditE = new Discord.MessageEmbed()

    channel.send(auditE
        .setColor('BLACK')
        .setAuthor(`Member Was Unbanned`, user.displayAvatarURL())
        .addField(`Unbanned Member`, `${user} \`${user.tag}\``)
        .setFooter(`Member ID: ${user.id}`)
        .setTimestamp()
    )
}