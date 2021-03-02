const { Channel, MessageEmbed } = require('discord.js');


module.exports = async (client, oldState, newState) => {

    const result = await client.DBSettings.findOne({ _id: newState.guild.id })
    if (!result) return;

    let auditLogChannel = result.auditLogChannelId

    const guildAudit = await client.DBAudit.findOne({ _id: newState.guild.id })

    if (auditLogChannel === undefined) return;
    if (guildAudit.voiceStateUpdate === undefined || guildAudit.voiceStateUpdate === 'Disabled') return;

    const Channel = client.channels.cache.get(auditLogChannel)
    const auditE = new MessageEmbed()
        .setColor('BLACK')
        .setAuthor(`Voice State Was Updated`, newState.guild.iconURL())
        .setFooter(`Member ID: ${newState.id}`)
        .setTimestamp()

    if (oldState.channelID === null && newState.channelID !== null) {
        auditE.addField(`Member`, `<@${oldState.id}>`, true).addField(`Voice Channel Joined`, `**<#${newState.channelID}>**`, true)
    } else if (oldState.channelID !== null && newState.channelID === null) {
        auditE.addField(`Member`, `<@${oldState.id}>`, true).addField(`Voice Channel Left`, `**<#${oldState.channelID}>**`, true)
    } else if (oldState.sessionID !== null && newState.channelID !== null) {
        auditE.addField(`Member`, `<@${oldState.id}>`, true).addField(`Voice Channel Switched`, `**<#${oldState.channelID}> \`to\` <#${newState.channelID}>**`, true)
    }

    Channel.send(auditE)
}