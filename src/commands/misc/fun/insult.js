const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../../utils/utils')
const fetch = require('node-fetch')

module.exports = {
    name: "insult",
    category: "Misc",
    aliases: ["ins"],
    description: "Insults a user",
    usage: "\`PREFIXinsult [user]\`",
    nsfwOnly: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let member = message.mentions.members.first()

        if (member == client.user.id) {
            const noRoastMe = new Discord.MessageEmbed
            message.channel.send(noRoastMe.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, you can\'t roast me.**`));
            return;
        }
        if (member == '751606134938402866') {
            const noRoastMe = new Discord.MessageEmbed
            message.channel.send(noRoastMe.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, you can\'t roast him.**`));
            return;
        }
        const insult = new Discord.MessageEmbed()
        if (!member) return message.channel.send(insult.setColor(message.guild.me.displayColor).setDescription(`**You sure you want to roast yourself?**`))

        let res = await fetch(
            `https://evilinsult.com/generate_insult.php?lang=en&type=json`
        );
        let json = await res.json();

        let iembed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`${member} **${json.insult}**`)
            .setFooter('💥 Roasted 💥')
        message.channel.send(iembed);
    }
}