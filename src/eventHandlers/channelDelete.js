const { Channel, MessageEmbed } = require('discord.js');

/**
 * channelDelete event
 * @param {import('../typings.d').myClient} client 
 * @param {Channel} channel 
 */
module.exports = async (client, channel) => {
    let guildInfo = client.guildInfoCache.get(channel.guild.id)
    if (!guildInfo) {
        const fetch = await client.DBGuild.findByIdAndUpdate(channel.guild.id, {}, { new: true, upsert: true, setDefaultsOnInsert: true });
        guildInfo = fetch
        delete guildInfo._id
        client.guildInfoCache.set(channel.guild.id, guildInfo)
    }

    auditChannelDelete(client, channel)

    deleteChannelEntry(client, channel, guildInfo)
}

let auditChannelDelete = async (client, channel) => {
    if (channel.type !== 'text') return;

    const result = await client.DBSettings.findOne({ _id: channel.guild.id })
    if (!result) return;

    let auditLogChannel = result.auditLogChannelId

    const guildAudit = await client.DBAudit.findOne({ _id: channel.guild.id })
    if (!guildAudit) return;

    if (auditLogChannel === undefined) return;
    if (guildAudit.channelDelete === undefined || guildAudit.channelDelete === 'Disabled') return;

    const Channel = client.channels.cache.get(auditLogChannel)

    Channel.send(new MessageEmbed()
        .setColor('BLACK')
        .setAuthor(`Channel Was Deleted`, channel.guild.iconURL())
        .addField(`Channel Deleted`, `\`#${channel.name}\``, true)
        .setFooter(`Channel ID: ${channel.id}`)
        .setTimestamp()
    )
}

let deleteChannelEntry = async (client, channel, guildInfo) => {
    if (channel.type !== 'text') return;

    let disabledChannels = guildInfo.disabledChannels

    if (!disabledChannels.includes(channel.id)) return;

    guildInfo = await client.DBGuild.findByIdAndUpdate(channel.guild.id, { $pull: { disabledChannels: channel.id } }, { new: true, upsert: true, setDefaultsOnInsert: true })
    client.guildInfoCache.set(channel.guild.id, guildInfo)
}
