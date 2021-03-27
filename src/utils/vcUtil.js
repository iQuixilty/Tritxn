const Discord = require('discord.js');
const message = require('../eventHandlers/message');

module.exports = {
    canModifyQueue(member) {
        const { channelID } = member.voice;
        const botChannel = member.guild.voice.channelID;

        if (member.voice === undefined || channelID === undefined || channelID !== botChannel) {
            member.send(new Discord.MessageEmbed().setColor(member.guild.me.displayColor)
                .setDescription("**Either this session has ended or you need to join the voice channel!**")).catch((e) => { return });
            return;
        }

        return true;
    }
};