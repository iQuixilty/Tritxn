const { Client, Role, MessageEmbed } = require('discord.js')


module.exports = async (client, role) => {
    let guildInfo = client.guildInfoCache.get(role.guild.id)
    if (!guildInfo) {
        const fetch = await client.DBGuild.findByIdAndUpdate(role.guild.id, {}, { new: true, upsert: true, setDefaultsOnInsert: true });
        guildInfo = {};
        guildInfo['prefix'] = fetch.prefix;
        if (fetch.disabledCommands) guildInfo.disabledCommands = fetch.disabledCommands;
        if (fetch.commandPerms) guildInfo.commandPerms = fetch.commandPerms
        if (fetch.commandCooldowns) guildInfo.commandCooldowns = fetch.commandCooldowns
        client.guildInfoCache.set(role.guild.id, guildInfo)
    }

    let commandCooldowns = guildInfo.commandCooldowns || {}

    for (const command of Object.keys(commandCooldowns)) {
        if (!commandCooldowns[command][role.id]) continue

        delete commandCooldowns[command][role.id]

        if (Object.keys(commandCooldowns[command]).length === 0) delete commandCooldowns[command]
    }

    await client.DBGuild.findByIdAndUpdate(role.guild.id, { $set: { commandCooldowns: commandCooldowns } }, { new: true, upsert: true, setDefaultsOnInsert: true })

    guildInfo.commandCooldowns = commandCooldowns
    client.guildInfoCache.set(role.guild.id, guildInfo)

    const result = await client.DBSettings.findOne({ _id: role.guild.id })

    let auditLogChannel = result.auditLogChannelId

    const guildAudit = await client.DBAudit.findOne({ _id: role.guild.id })

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
