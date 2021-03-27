const { MessageEmbed } = require('discord.js');
const { getGuildAudit, getGuildInfo, getGuildSettings, getGuildLevels } = require('../utils/utils')

/**
 * roleUpdate event
 * @param {import('../typings.d').myClient} client 
 * @param {import('discord.js').Role} oldRole 
 * @param {import('discord.js').Role} newRole
 */

module.exports = async (client, oldRole, newRole) => {

    const result = await getGuildSettings(client, newRole.guild.id)
    if (!result) return;

    let auditLogChannel = result.auditLogChannelId

    const guildAudit = await getGuildAudit(client, newRole.guild.id)
    if (!guildAudit) return;

    if (auditLogChannel === undefined) return;
    if (guildAudit.roleUpdate === undefined || guildAudit.roleUpdate === 'Disabled') return;


    if (oldRole.rawPosition !== newRole.rawPosition) return;

    const Channel = client.channels.cache.get(auditLogChannel)
    const auditE = new MessageEmbed()
        .setColor('BLACK')
        .setAuthor(`Role Was Updated`, newRole.guild.iconURL())
        .addField(`Role Updated`, `${newRole} \`${newRole.name}\``, true)
        .setFooter(`Role ID: ${newRole.id}`)
        .setTimestamp()

    if (oldRole.color !== newRole.color) auditE.addField(`Old Role Color`, `\`#${oldRole.color}\``).addField(`New Role Color`, `\`#${newRole.color}\``)
    if (oldRole.name !== newRole.name) auditE.addField(`Old Role Name`, `\`${oldRole.name}\``).addField(`New Role Name`, `\`${newRole.name}\``)

    Channel.send(auditE)

}