const Discord = require('discord.js')
const PREFIX = require('../../config/config.json').PREFIX;


module.exports = async (client, messages) => {
    let guildSettings = client.guildSettingsCache.get(messages.first().guild.id)
    let guildAudit = client.guildAuditCache.get(messages.first().guild.id)
    if (!guildSettings) return
    if (!guildAudit) return;


    if (guildSettings.auditLogChannelId === undefined || guildSettings.auditLogChannelId === 'Disabled') return;
    if (guildAudit.messageDeleteBulk === undefined || guildAudit.messageDeleteBulk === 'Disabled') return;

    const channel = client.channels.cache.get(guildSettings.auditLogChannelId)

    const length = messages.array().length;
    const channelId = messages.first().channel.id;

    const embed = new Discord.MessageEmbed()
        .setAuthor(`Bulk Messages Deleted`, messages.first().author.displayAvatarURL())
        .addField(`Amount Deleted`, `\`${length}\``)
        .addField(`Bulk Deleted In`, `<#${channelId}>`,)
        .setFooter(`Author ID: ${messages.first().author.id}`)
        .setColor('BLACK')
        .setTimestamp();

    channel.send(embed);
}