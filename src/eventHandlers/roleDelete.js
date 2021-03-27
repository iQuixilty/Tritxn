const { Client, Role, MessageEmbed } = require('discord.js')
const { getGuildAudit, getGuildInfo, getGuildSettings, getGuildLevels } = require('../utils/utils')

/**
 * roleDelete event
 * @param {import('../typings.d').myClient} client 
 * @param {import('discord.js').Role} role 
 */

module.exports = async (client, role) => {
    let guildInfo = await getGuildInfo(client, role.guild.id);
    
    let commandCooldowns = guildInfo.commandCooldowns || {};

    let update = false;

    for (const command of Object.keys(commandCooldowns)) {
        if (!commandCooldowns[command][role.id]) continue;

        update = true;
        delete commandCooldowns[command][role.id];

        if (Object.keys(commandCooldowns[command]).length === 0) delete commandCooldowns[command];
    }

    guildInfo = await client.DBGuild.findByIdAndUpdate(role.guild.id, { $set: { commandCooldowns: commandCooldowns } }, { new: true, upsert: true, setDefaultsOnInsert: true });
    client.guildInfoCache.set(role.guild.id, guildInfo)

    auditRole(client, role)
}

const auditRole = async (client, role) => {
    const result = await getGuildSettings(client, role.guild.id)
    if (!result) return;

    let auditLogChannel = result.auditLogChannelId

    const guildAudit = await getGuildAudit(client, role.guild.id)
    if (!guildAudit) return;

    if (auditLogChannel === undefined) return;
    if (guildAudit.roleDelete === undefined || guildAudit.roleDelete === 'Disabled') return;

    const Channel = client.channels.cache.get(auditLogChannel)

    Channel.send(new MessageEmbed()
        .setColor('BLACK')
        .setAuthor(`Role Was Deleted`, role.guild.iconURL())
        .addField(`Role Deleted`, `\`${role.name}\``, true)
        .setFooter(`Role ID: ${role.id}`)
        .setTimestamp()
    )
}
