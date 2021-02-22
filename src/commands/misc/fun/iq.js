const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

module.exports = {
    name: "iq",
    category: "Misc",
    aliases: ["IQ"],
    description: "Calculates a users IQ",
    usage: "\`PREFIXiq [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const iq = Math.floor(Math.random() * 100) + 1;

        let member;

        if (!message.mentions.members.first()) {
            member = message.guild.members.cache.get(message.author.id);
        } else {
            member = message.mentions.members.first()
        }

        const iEmbed = new Discord.MessageEmbed()
            .setTitle("IQ Test")
            .setColor(message.guild.me.displayColor)
            .setAuthor(`${member.user.username}`, member.user.displayAvatarURL())
            .setDescription(`${member.user}'s IQ is: \`${iq}\`!`)

        const ioEmbed = new Discord.MessageEmbed()
            .setTitle("IQ Test")
            .setColor(message.guild.me.displayColor)
            .setAuthor(`${member.user.username}`, member.user.displayAvatarURL())
            .setDescription(`Your IQ is: \`1,000,000,000,000\`!`)

        if (member != `751606134938402866`) {
            message.channel.send(iEmbed);
        } else {
            message.channel.send(ioEmbed);
        };
    }
}