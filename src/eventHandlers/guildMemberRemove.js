const { Guild, Client, MessageEmbed } = require('discord.js')
const PREFIX = require('../../config/config.json').PREFIX;

const moment = require('moment')

module.exports = async (client, member) => {
    const onLeave = async member => {
        const { guild } = member

        const result = await client.DBSettings.findOne({ _id: guild.id })
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


    onLeave(member).catch((e) => { return; })

    const result = await client.DBSettings.findOne({ _id: member.guild.id })

    let auditLogChannel = result.auditLogChannelId

    const guildAudit = await client.DBAudit.findOne({ _id: member.guild.id })


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