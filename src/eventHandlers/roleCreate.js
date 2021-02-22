const { Channel, MessageEmbed } = require('discord.js');


module.exports = async (client, role) => {

    const result = await client.DBSettings.findOne({ _id: role.guild.id })

    let auditLogChannel = result.auditLogChannelId

    const guildAudit = await client.DBAudit.findOne({ _id: role.guild.id })

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