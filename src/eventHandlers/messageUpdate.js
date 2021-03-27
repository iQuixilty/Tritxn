const Discord = require('discord.js')
const PREFIX = require('../../config/config.json').PREFIX;
const { filterOutWords, filterMarkdownWords, getGuildAudit, getGuildInfo, getGuildSettings } = require('../utils/utils')
const leven = require('leven')

/**
 * messageUpdate event
 * @param {import('../typings.d').myClient} client 
 * @param {import('discord.js').Message} message 
 * @param {import('discord.js').Message} newMessage
 */


module.exports = async (client, message, newMessage) => {
    if (message.author.bot) return;
    let args = newMessage.content.trim().split(/ +/);

    esnipes(client, message, newMessage)
    auditMessage(client, message, newMessage)
    auditBLedWords(client, message, newMessage, args)
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

const auditBLedWords = async (client, message, newMessage, args) => {
    let guildInfo = await getGuildInfo(client, message.guild.id)
    let guildSettings = await getGuildSettings(client, message.guild.id)

    if (!message.member.permissions.has('ADMINISTRATOR')) {
        if (guildInfo.disabledWords === undefined) return;

        let result = filterMarkdownWords(guildInfo.disabledWords, args)
        let rawContent = result.split(' ')
        let diff;

        for (let i = 0; i < rawContent.length; i++) {
            for (let j = 0; j < guildInfo.disabledWords.length; j++) {
                let res = leven(rawContent[i], guildInfo.disabledWords[j])
                if (res < 2) {
                    diff = true
                }
            }
        }
        if (guildInfo.disabledWords.some((a) => result.toLowerCase().includes(a))) {
            message.channel.send(new Discord.MessageEmbed()
                .setColor(newMessage.guild.me.displayColor)
                .setDescription(`**That word is blacklisted here**`))
                .then(msg => { msg.delete({ timeout: 5000 }) }).catch((e) => { return })

            message.delete().catch((e) => { return })

            if (guildSettings.auditLogChannelId === undefined || guildSettings.auditLogChannelId === 'Disabled') return;
            const channel = client.channels.cache.get(guildSettings.auditLogChannelId)
            if (!channel) return;

            return channel.send(new Discord.MessageEmbed()
                .setColor('RED')
                .setAuthor(`Blacklisted Word`, message.author.displayAvatarURL())
                .addField(`${message.author.username} Sent`, newMessage.content.length > 1023 ? 'Too Many Characters' : `\`${newMessage.content}\``)
                .addField(`Message Was Sent In`, `${message.channel}`,)
                .setFooter(`Author Id: ${message.author.id}`)
                .setTimestamp())
        }

        if (diff && !(guildInfo.disabledWords.some((a) => result.toLowerCase().includes(a)))) {
            if (guildSettings.auditLogChannelId === undefined || guildSettings.auditLogChannelId === 'Disabled') return;
            const channel = client.channels.cache.get(guildSettings.auditLogChannelId)
            return channel.send(new Discord.MessageEmbed()
                .setColor('RED')
                .setAuthor(`Potential Blacklisted Word`, message.author.displayAvatarURL())
                .addField(`${message.author.username} Sent`, newMessage.content.length > 1023 ? 'Too Many Characters' : `\`${newMessage .content}\``)
                .addField(`Message Was Sent In`, `${message.channel}`,)
                .setFooter(`Author Id: ${message.author.id}`)
                .setTimestamp())
        }
    }
}

const auditMessage = async (client, message, newMessage) => {
    let guildSettings = await getGuildSettings(client, message.guild.id)
    if (!guildSettings) return;

    let guildAudit = await getGuildAudit(client, message.guild.id)
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
