const Discord = require('discord.js')
const PREFIX = require('../../config/config.json').PREFIX;


module.exports = async (client, guild, user) => {

    let guildAudit =   await client.DBAudit.findOne({ _id: guild.id })

    const result = await client.DBSettings.findOne({ _id: guild.id })
    if (!result) return;
    
    let auditLogChannel = result.auditLogChannelId
    
    if (auditLogChannel === undefined) return;
    if (guildAudit.guildBanAdd === undefined || guildAudit.guildBanAdd === 'Disabled') return;


    const channel = client.channels.cache.get(auditLogChannel)

    const auditE = new Discord.MessageEmbed()

    channel.send(auditE
        .setColor('BLACK')
        .setAuthor(`Member Was Banned`, user.displayAvatarURL())
        .addField(`Banned Member`, `${user} \`${user.tag}\``)
        .setFooter(`Member ID: ${user.id}`)
        .setTimestamp()
    )


}