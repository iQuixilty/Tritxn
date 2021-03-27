const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../utils/utils')
module.exports = {
    name: "rps",
    category: "Games",
    description: "Starts a game of rock, paper, scissors",
    usage: "\`PREFIXrps\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        const rpsE = new Discord.MessageEmbed()

        const rps = ['scissors', 'rock', 'paper'];
        const res = ['Scissors :scissors:', 'Rock :rock:', 'Paper :newspaper:'];

        let userChoice;
        if (args.length) userChoice = args[0].toLowerCase();

        if (!rps.includes(userChoice)) {
            return message.channel.send(rpsE.setColor(message.guild.me.displayColor).setTitle('Please enter rock, paper, or scissors'));
        }

        userChoice = rps.indexOf(userChoice);
        const botChoice = Math.floor(Math.random() * 3);

        let result;

        if (userChoice === botChoice) result = 'It\'s a draw!';
        else if (botChoice > userChoice || botChoice === 0 && userChoice === 2) result = `**${client.user.username}** wins!`;

        else result = `**${message.member.displayName}** wins!`;

        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.member.displayName} vs. Randxm`)
            .addField('Your Choice:', res[userChoice], true)
            .addField(`Tritxn\'s Choice`, res[botChoice], true)
            .addField('Result', result)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(message.guild.me.displayColor);
        message.channel.send(embed);
    }
}