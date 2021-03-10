const { Guild, Client, MessageEmbed } = require('discord.js')
const PREFIX = require('../../config/config.json').PREFIX;

module.exports = async (client, guild) => {

    logLeave(client, guild)
}

let logLeave = async (client, guild) => {
    const channelId = '784592088729255946';
    const channel = client.channels.cache.get(channelId);
    const sowner = guild.owner;
    if (!channel) return;

    const embed = new MessageEmbed()
        .setTitle('I Left A Guild!')
        .setDescription(`**Guild Name:** ${guild.name} (${guild.id})\n**Members:** ${guild.memberCount}\n**Owner:** ${sowner}`)
        .setTimestamp()
        .setColor('RED')
        .setFooter(`I'm In ${client.guilds.cache.size} Guilds Now!`);
    channel.send(embed);
}

