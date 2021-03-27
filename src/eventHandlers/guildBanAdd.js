const Discord = require('discord.js')
const PREFIX = require('../../config/config.json').PREFIX;
const { getGuildInfo, getGuildAudit, getGuildLevels, getGuildSettings } = require("../utils/utils")

module.exports = async (client, guild, user) => {

    const result = await getGuildSettings(client, guild.id)
    let guildAudit = await getGuildAudit(client, guild.id)
    
    bannedMember(client, guild, user, result, guildAudit)
}

let bannedMember = async (client, guild, user, result, guildAudit) => {
    if (!result) return;
    if (!guildAudit) return;

    let auditLogChannel = result.auditLogChannelId

    if (auditLogChannel === undefined) return;
    if (guildAudit.guildBanAdd === undefined || guildAudit.guildBanAdd === 'Disabled') return;


    const channel = client.channels.cache.get(auditLogChannel)

    const auditE = new Discord.MessageEmbed()

    channel.send(auditE
        .setColor('BLACK')
        .setAuthor(`Member Was Banned`, user.displayAvatarURL())
        .addField(`Banned Member`, `${user} \`${user.tag}\``)
        .setFooter(`Member ID: ${user.id}`)
        .setTimestamp()
    )
}