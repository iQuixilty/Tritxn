const { Guild, Client, MessageEmbed } = require('discord.js')
const { getGuildInfo, getGuildAudit, getGuildLevels, getGuildSettings } = require("../utils/utils")
const moment = require('moment')

/**
 * @param {import('../typings.d').myClient} client 
 * @param {import('discord.js').GuildMember} member 
 */

module.exports = async (client, member) => {
    const result = await getGuildSettings(client, member.guild.id)

    onLeave(client, member, result).catch((e) => { return; })

    auditMembers(client, member, result).catch((e) => { return; })
}

const onLeave = async (client, member, result) => {
    const { guild } = member
    if (!result) return;

    const channelId = result.leaveChannelId
    if (channelId === undefined) return;

    const text = result.leaveChannelText
    const channel = guild.channels.cache.get(channelId)
    if (!channel) return;

    const leaveMSG = new MessageEmbed()
    channel.send(leaveMSG
        .setAuthor(`${member.user.username}`, `${member.user.displayAvatarURL({ dynamic: true })}`)
        .setTitle(`${member.user.username} Left`)
        .setColor(member.guild.me.displayColor)
        .setThumbnail(member.guild.iconURL())
        .setDescription(text
            .replace(/{user}/g, `<@${member.id}>`)
            .replace(/{username}/g, `${member.user.username}`)
            .replace(/{usertag}/g, `${member.user.tag}`)
            .replace(/{membercount}/g, `${member.guild.memberCount}`)
            .replace(/{guild}/g, `${member.guild.name}`)
            .replace(/{creation}/g, `${moment(new Date(member.guild.createdAt).toUTCString()).format('MM/DDD/YY')}`)))

}

const auditMembers = async (client, member, result) => {
    if (!result) return;
    let auditLogChannel = result.auditLogChannelId

    const guildAudit = await getGuildAudit(client, member.guild.id)
    if (!guildAudit) return;

    if (auditLogChannel === undefined) return;
    if (guildAudit.guildMemberRemove === undefined || guildAudit.guildMemberRemove === 'Disabled') return;

    const channel = client.channels.cache.get(auditLogChannel)

    channel.send(new MessageEmbed()
        .setColor('BLACK')
        .setAuthor(`${member.user.tag} Left`)
        .setDescription(`${member} \`(${member.id})\` Left The Server`)
        .setThumbnail(member.user.displayAvatarURL())
        .setFooter(`Member ID: ${member.id}`)
        .setTimestamp()
    ).catch((e) => {
        return;
    })
}