const { Channel, MessageEmbed } = require('discord.js');
const { getGuildInfo, getGuildAudit, getGuildLevels, getGuildSettings } = require("../utils/utils")

module.exports = async (client, channel) => {
    if (!channel.guild) return;
    if (channel.type !== 'text') return;

    let guildInfo = await getGuildInfo(client, channel.guild.id);
    let guildSettings = await getGuildSettings(client, channel.guild.id)
    let guildAudit = await getGuildAudit(client, channel.guild.id)
    let guildLevels = await getGuildLevels(client, channel.guild.id)

    createdChannel(client, channel)
}

let createdChannel = async (client, channel) => {

    if (channel.type !== 'text') return;

    const result = await getGuildSettings(client, channel.guild.id)
    if (!result) return;

    let auditLogChannel = result.auditLogChannelId

    const guildAudit = await getGuildAudit(client, channel.guild.id)
    if (!guildAudit) return;

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