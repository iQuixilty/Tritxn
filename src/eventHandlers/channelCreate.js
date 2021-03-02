const { Channel, MessageEmbed } = require('discord.js');


module.exports = async (client, channel) => {

    if (channel.type !== 'text') return;

    const result = await client.DBSettings.findOne({ _id: channel.guild.id })
    if (!result) return;

    let auditLogChannel = result.auditLogChannelId

    const guildAudit = await client.DBAudit.findOne({ _id: channel.guild.id })

    if (auditLogChannel === undefined) return;
    if (guildAudit.channelCreate === undefined || guildAudit.channelCreate === 'Disabled') return;

    const Channel = client.channels.cache.get(auditLogChannel)

    Channel.send(new MessageEmbed()
        .setColor('BLACK')
        .setAuthor(`Channel Was Created`, channel.guild.iconURL())
        .addField(`Channel Created`, `\`#${channel.name}\``, true)
        .setFooter(`Channel ID: ${channel.id}`)
        .setTimestamp()
    )

}