const Discord = require('discord.js')
const PREFIX = require('../../config/config.json').PREFIX;


module.exports = async (client, message) => {

    if (message.author.bot) return;

    let guildSettings = client.guildSettingsCache.get(message.guild.id)

    let guildAudit = client.guildAuditCache.get(message.guild.id)

    let guildInfo = client.guildInfoCache.get(message.guild.id)

    snipes(client, message)
    blacklistedWords(client, message, guildInfo, guildSettings)
    auditLog(client, message, guildAudit, guildSettings, guildInfo)
    ghostPing(client, message, guildAudit, guildSettings, guildInfo)

}

function snipes(client, message) {
    const snipes = client.snipes.get(message.channel.id) || []

    snipes.unshift({
        content: message.content,
        author: message.author,
        image: message.attachments.first() ? message.attachments.first().proxyURL : null,
        date: new Date().toLocaleString("en-GB", { dataStyle: "full", timeStyle: "short" })
    })
    snipes.splice(10);

    client.snipes.set(message.channel.id, snipes)
}

function blacklistedWords(client, message, guildInfo, guildSettings) {
    if (guildInfo.disabledWords === undefined) return;

    if (guildInfo.disabledWords.some((a) => message.content.includes(a))) {

        if (guildSettings.auditLogChannelId === undefined || guildSettings.auditLogChannelId === 'Disabled') return;
        const channel = client.channels.cache.get(guildSettings.auditLogChannelId)

        return channel.send(new Discord.MessageEmbed()
            .setColor('RED')
            .setAuthor(`Blacklisted Word`, message.author.displayAvatarURL())
            .addField(`${message.author.username} Sent`, message.content.length > 1023 ? 'Too Many Characters' : `\`${message.content}\``)
            .addField(`Message Was Sent In`, `${message.channel}`,)
            .setFooter(`Author Id: ${message.author.id}`)
            .setTimestamp())
    }
}

function auditLog(client, message, guildAudit, guildSettings, guildInfo) {

    if (guildSettings.auditLogChannelId === undefined || guildSettings.auditLogChannelId === 'Disabled') return;
    if (guildAudit.messageDelete === undefined || guildAudit.messageDelete === 'Disabled') return;

    const channel = client.channels.cache.get(guildSettings.auditLogChannelId)

    const auditE = new Discord.MessageEmbed()

    channel.send(auditE
        .setColor('BLACK')
        .setAuthor(`Message Deleted By ${message.author.tag}`, message.author.displayAvatarURL())
        .addField(`Sent`, message.content === '' ? 'The deleted message was most likely an image' : message.content.length > 1023 ? 'Too Many Characters' : `${message.content}`)
        .addField(`Message Was Sent In`, `${message.channel}`,)
        .setFooter(`Author ID: ${message.author.id}`)
        .setTimestamp()
    )
}

function ghostPing(client, message, guildAudit, guildSettings, guildInfo) {
    if (!guildSettings) return;
    let ghostPingSetting = guildSettings.ghostPing

    if (ghostPingSetting === 'Disabled' || ghostPingSetting === undefined) return;

    if (message.mentions.members.first()
        && !message.mentions.members.first().user.bot
        && message.mentions.members.first().user.id !== message.author.id
        && !message.author.bot) {

        let embed = new Discord.MessageEmbed()
            .setTitle('Ghost Ping Detected!')
            .setColor(message.guild.me.displayColor)
            .addField('Author', message.author)
            .addField('Message', message.content);

        message.channel.send(embed)
    }
}