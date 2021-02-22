const Discord = require('discord.js')
const PREFIX = require('../../config/config.json').PREFIX;


module.exports = async (client, guild, user) => {
    let guildAudit = await client.DBAudit.findOne({ _id: guild.id })

    const result = await client.DBSettings.findOne({ _id: guild.id })

    let auditLogChannel = result.auditLogChannelId

    if (auditLogChannel === undefined) return;
    if (guildAudit.guildBanRemove === undefined || guildAudit.guildBanRemove === 'Disabled') return;


    const channel = client.channels.cache.get(auditLogChannel)

    const auditE = new Discord.MessageEmbed()

    channel.send(auditE
        .setColor('BLACK')
        .setAuthor(`Member Was Unbanned`, user.displayAvatarURL())
        .addField(`Unbanned Member`, `${user} \`${user.tag}\``)
        .setFooter(`Member ID: ${user.id}`)
        .setTimestamp()
    )


}