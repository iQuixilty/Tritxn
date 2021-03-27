const { Channel, MessageEmbed } = require('discord.js');
const { getGuildInfo, getGuildAudit, getGuildLevels, getGuildSettings } = require("../utils/utils")

/**
 * channelDelete event
 * @param {import('../typings.d').myClient} client 
 * @param {import('discord.js').GuildChannel} channel 
 */
module.exports = async (client, channel) => {
    if (!channel.guild) return;
    if (channel.type !== 'text') return;

    let guildInfo = await getGuildInfo(client, channel.guild.id);

    auditChannelDelete(client, channel)

    deleteChannelEntry(client, channel, guildInfo)
}

let auditChannelDelete = async (client, channel) => {
    if (channel.type !== 'text') return;

    const result = await getGuildSettings(client, channel.guild.id)
    if (!result) return;

    let auditLogChannel = result.auditLogChannelId

    const guildAudit = await getGuildAudit(client, channel.guild.id)
    if (!guildAudit) return;

    if (auditLogChannel === undefined) return;
    if (guildAudit.channelDelete === undefined || guildAudit.channelDelete === 'Disabled') return;

    const Channel = client.channels.cache.get(auditLogChannel)
    if (!Channel === undefined) return
    Channel.send(new MessageEmbed()
        .setColor('BLACK')
        .setAuthor(`Channel Was Deleted`, channel.guild.iconURL())
        .addField(`Channel Deleted`, `\`#${channel.name}\``, true)
        .setFooter(`Channel ID: ${channel.id}`)
        .setTimestamp()
    )
}

let deleteChannelEntry = async (client, channel, guildInfo) => {
    let disabledChannels = guildInfo.disabledChannels

    if (!disabledChannels.includes(channel.id)) return;

    guildInfo = await client.DBGuild.findByIdAndUpdate(channel.guild.id, { $pull: { disabledChannels: channel.id } }, { new: true, upsert: true, setDefaultsOnInsert: true });
    client.guildInfoCache.set(channel.guild.id, guildInfo);
}
