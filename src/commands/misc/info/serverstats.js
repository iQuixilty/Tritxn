const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const { version } = require('../../../../package.json');

module.exports = {
    name: "serverstats",
    category: "Misc",
    aliases: ["sstats"],
    description: "Displays user information about the server",
    usage: "\`PREFIXserverstats\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const Embed = new Discord.MessageEmbed()
            .setTitle('Server Statistics')
            .addFields({
                name: 'Total',
                value: message.guild.members.cache.size,
                inline: false
            }, {
                name: 'Online',
                value: message.guild.members.cache.filter(m => m.user.presence.status === 'online' && !m.user.bot).size,
                inline: true
            }, {
                name: 'Idle',
                value: message.guild.members.cache.filter(m => m.user.presence.status === 'idle' && !m.user.bot).size,
                inline: true
            }, {
                name: 'Do not disturb',
                value: message.guild.members.cache.filter(m => m.user.presence.status === 'dnd' && !m.user.bot).size,
                inline: true
            }, {
                name: 'Offline',
                value: message.guild.members.cache.filter(m => m.user.presence.status === 'offline' && !m.user.bot).size,
                inline: true
            }, {
                name: 'Bots',
                value: message.guild.members.cache.filter(m => m.user.bot).size,
                inline: true
            })
            .setThumbnail(message.guild.iconURL())
            .setFooter(`${message.guild.name}'s Member Statistics`, client.user.displayAvatarURL())
            .setColor(message.guild.me.displayColor)
        message.channel.send(Embed)
    }
}