const { Channel, MessageEmbed } = require('discord.js');
const { getGuildAudit, getGuildInfo, getGuildSettings, getGuildLevels } = require('../utils/utils')

/**
 * roleCreate event
 * @param {import('../typings.d').myClient} client 
 * @param {import('discord.js').Role} role 
 */

module.exports = async (client, role) => {
    const result = await getGuildSettings(client, role.guild.id)
    if (!result) return;

    let auditLogChannel = result.auditLogChannelId

    const guildAudit = await getGuildAudit(client, role.guild.id)
    if (!guildAudit) return;

    if (auditLogChannel === undefined) return;
    if (guildAudit.roleCreate === undefined || guildAudit.roleCreate === 'Disabled') return;

    const Channel = client.channels.cache.get(auditLogChannel)

    Channel.send(new MessageEmbed()
        .setColor('BLACK')
        .setAuthor(`Role Was Created`, role.guild.iconURL())
        .addField(`Role Created`, `${role} \`${role.name}\``, true)
        .setFooter(`Role ID: ${role.id}`)
        .setTimestamp()
    )

}