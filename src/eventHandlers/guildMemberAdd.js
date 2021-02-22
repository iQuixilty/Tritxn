const { Guild, Client, MessageEmbed } = require('discord.js')
const PREFIX = require('../../config/config.json').PREFIX;

const nameRegExp = /^[a-zA-Z0-9~`!@#\$%\^&\*\(\)_\-\+={\[\}\]\|\\:;"'<,>\.\?\/  ]{1,32}$/;


module.exports = async (client, member) => {
    const onJoin = async member => {
        const { guild } = member

        const result = await client.DBSettings.findOne({ _id: guild.id })

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
            .setDescription(text.replace(/<@>/g, `<@${member.id}>`)))

    }

    onJoin(member)

    const autoRole = async (member) => {
        const result = await client.DBSettings.findOne({ _id: member.guild.id })

        let roleId = result.autoRoleId
        if (!roleId) return;
        if (member.roles.cache.has(roleId)) return;

        member.roles.add(roleId)
    }

    autoRole(member)

    const result = await client.DBSettings.findOne({ _id: member.guild.id })
    let decancer = result.decancer

    if (decancer === 'Enabled') {
        if (!nameRegExp.test(member.user.username)) {
            member.setNickname('Choose A Better Name')
        }
    }

    let auditLogChannel = result.auditLogChannelId

    const guildAudit = await client.DBAudit.findOne({ _id: member.guild.id })


    if (auditLogChannel === undefined ) return;
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