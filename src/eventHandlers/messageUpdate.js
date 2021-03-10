const Discord = require('discord.js')
const PREFIX = require('../../config/config.json').PREFIX;


module.exports = async (client, message, newMessage) => {

    if (message.author.bot) return;

    esnipes(client, message, newMessage)
    auditMessage(client, message, newMessage)

}

const esnipes = async (client, message, newMessage) => {
    const esnipes = client.esnipes.get(message.channel.id) || []

    esnipes.unshift({
        content: message.content,
        author: message.author,
        date: new Date().toLocaleString("en-GB", { dataStyle: "full", timeStyle: "short" })
    })
    esnipes.splice(5);

    client.esnipes.set(message.channel.id, esnipes)
}

const auditMessage = async (client, message, newMessage) => {
    let guildSettings = client.guildSettingsCache.get(message.guild.id)
    if (!guildSettings) return;

    let guildAudit = client.guildAuditCache.get(message.guild.id)
    if (!guildAudit) return

    if (guildSettings.auditLogChannelId === undefined || guildSettings.auditLogChannelId === 'Disabled') return;
    if (guildAudit.messageUpdate === undefined || guildAudit.messageUpdate === 'Disabled') return;

    const channel = client.channels.cache.get(guildSettings.auditLogChannelId)

    if (message.content === '') return;
    if (message.embeds.length != newMessage.embeds.length) return;

    channel.send(new Discord.MessageEmbed()
        .setColor('BLACK')
        .setAuthor(`Message Edited By ${message.author.tag}`, message.author.displayAvatarURL())
        .addField(`Orginal Message`, message.content.length > 1023 ? 'Too Many Characters' : `${message.content}`,)
        .addField(`New Message`, newMessage.content.length > 1023 ? 'Too Many Characters' : `${newMessage.content}`, true)
        .addField(`Message Was Sent In`, `[Click Here](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}) **|** ${message.channel}`,)
        .setFooter(`Author ID: ${message.author.id}`)
        .setTimestamp()
    )
}