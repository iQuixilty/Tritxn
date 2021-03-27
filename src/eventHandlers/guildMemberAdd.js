const { Guild, Client, MessageEmbed } = require('discord.js')
const PREFIX = require('../../config/config.json').PREFIX;
const { getGuildInfo, getGuildAudit, getGuildLevels, getGuildSettings } = require("../utils/utils")

const nameRegExp = /^[a-zA-Z0-9~`!@#\$%\^&\*\(\)_\-\+={\[\}\]\|\\:;"'<,>\.\?\/  ]{1,32}$/;
const moment = require('moment')

/**
 * @param {import('../typings.d').myClient} client 
 * @param {import('discord.js').GuildMember} member 
 */

module.exports = async (client, member) => {
    const result = await getGuildSettings(client, member.guild.id)
    const guildInfo = await getGuildInfo(client, member.guild.id)

    onJoin(client, member, result)

    autoRole(client, member, result)

    decancer(client, member, result)

    auditMembers(client, member, result)

    checkIsMuted(client, member, guildInfo)
}

const checkIsMuted = async (client, member, guildInfo) => {
    let mutes = guildInfo.mutes
    let mutedRole = guildInfo.mutedRole
    if (mutes && mutes.length > 0) {
        if (mutes.includes(member.user.id)) {
            if (!mutedRole) return
            let role = member.guild.roles.cache.get(mutedRole)
            member.roles.add(role).catch((e) => {
                return
            })
        }
    }
}

const onJoin = async (client, member, result) => {
    const { guild } = member
    if (!result) return;

    const channelId = result.welcomeChannelId

    if (channelId === undefined) return;

    const text = result.welcomeChannelText
    const channel = guild.channels.cache.get(channelId)

    const welcomeMSG = new MessageEmbed()
    channel.send(welcomeMSG
        .setAuthor(`${member.user.username}`, `${member.user.displayAvatarURL({ dynamic: true })}`)
        .setTitle(`Welcome ${member.user.username}!`)
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

const autoRole = async (client, member, result) => {
    if (!result) return;

    let roleId = result.autoRoleId
    if (!roleId) return;
    if (member.roles.cache.has(roleId)) return;

    member.roles.add(roleId).catch((e) => { return })
}

const decancer = async (client, member, result) => {
    if (!result) return;
    let decancer = result.decancer

    if (decancer === true) {
        if (!nameRegExp.test(member.user.username)) {
            member.setNickname('Choose A Better Name').catch((e) => { return })
        }
    }
}

const auditMembers = async (client, member, result) => {
    if (!result) return;
    let auditLogChannel = result.auditLogChannelId

    const guildAudit = await getGuildAudit(client, member.guild.id)
    if (!guildAudit) return;


    if (auditLogChannel === undefined) return;
    if (guildAudit.guildMemberAdd === undefined || guildAudit.guildMemberAdd === 'Disabled') return;

    const channel = client.channels.cache.get(auditLogChannel)

    channel.send(new MessageEmbed()
        .setColor('BLACK')
        .setAuthor(`${member.user.tag} Joined`)
        .setDescription(`${member} \`(${member.id})\` Joined The Server`)
        .setThumbnail(member.user.displayAvatarURL())
        .setFooter(`Member ID: ${member.id}`)
        .setTimestamp()
    )
}