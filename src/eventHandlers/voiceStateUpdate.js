const { Channel, MessageEmbed } = require('discord.js');
const { getGuildAudit, getGuildInfo, getGuildSettings, getGuildLevels } = require('../utils/utils')

/**
 * voiceStateUpdate event
 * @param {import('../typings.d').myClient} client 
 * @param {import('discord.js').VoiceState} oldState
 * @param {import('discord.js').VoiceState} newState 
 */

module.exports = async (client, oldState, newState) => {

    const result = await getGuildSettings(client, newState.guild.id)
    if (!result) return;

    let auditLogChannel = result.auditLogChannelId

    const guildAudit = await getGuildAudit(client, newState.guild.id)

    if (auditLogChannel === undefined) return;
    if (guildAudit.voiceStateUpdate === undefined || guildAudit.voiceStateUpdate === 'Disabled') return;

    const Channel = client.channels.cache.get(auditLogChannel)
    const auditE = new MessageEmbed()
        .setColor('BLACK')
        .setAuthor(`Voice State Was Updated`, newState.guild.iconURL())
        .setFooter(`Member ID: ${newState.id}`)
        .setTimestamp()

    if (oldState.channelID === null && newState.channelID !== null) {
        auditE
            .addField(`Member`, `<@${oldState.id}>`, true)
            .addField(`Voice Channel Joined`, `**<#${newState.channelID}>**`, true)
    } else if (oldState.channelID !== null && newState.channelID === null) {
        auditE
            .addField(`Member`, `<@${oldState.id}>`, true)
            .addField(`Voice Channel Left`, `**<#${oldState.channelID}>**`, true)
    } else if (oldState.sessionID !== null && newState.channelID !== null) {
        auditE
            .addField(`Member`, `<@${oldState.id}>`, true)
            .addField(`Voice Channel Switched`, `**<#${oldState.channelID}> \`to\` <#${newState.channelID}>**`, true)
    }

    Channel.send(auditE)
}