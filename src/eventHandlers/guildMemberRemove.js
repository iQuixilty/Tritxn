const { Guild, Client, MessageEmbed } = require('discord.js')
const PREFIX = require('../../config/config.json').PREFIX;

const mongo = require('../../schemas/mongo')


module.exports = async (client, member) => {
    const onLeave = async member => {
        const { guild } = member

        const result = await client.DBSettings.findOne({ _id: guild.id })


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
            .setDescription(text.replace(/<@>/g, `<@${member.id}>`)))

    }


    onLeave(member)

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
    )
}