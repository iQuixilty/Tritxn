const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../../utils/utils')
const ms = require('ms');

module.exports = {
    name: "remind",
    category: "Misc",
    aliases: ["rem", "timer"],
    description: "Reminds of you somthing within a time limit",
    usage: "\`PREFIXremind [time] [reminder]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        const remind = new Discord.MessageEmbed()

        let timeuser = args[0]
        let reason = args.slice(1).join(" ")

        if (!timeuser || isNaN(ms(timeuser))) return message.channel.send(remind.setColor((message.guild.me.displayColor)).setDescription("**Please specify a valid time limit please.**"))

        if (!reason) return message.channel.send(remind.setColor((message.guild.me.displayColor)).setDescription("**Please specify a thing to be reminded of.**"))


        message.channel.send(new Discord.MessageEmbed()
            .setColor((message.guild.me.displayColor))
            .setTitle("Reminder").setDescription(`Alright, I will remind you in ${ms(ms(timeuser), { long: true })} of \`${reason}\``).setTimestamp())


        setTimeout(function () {
            message.channel.send(new Discord.MessageEmbed()
                .setColor((message.guild.me.displayColor))
                .setTitle("Reminder")
                .setDescription(`${message.author}, your timer is over. Check your dms.`)
                .setTimestamp())

            message.author.send(new Discord.MessageEmbed()
                .setColor((message.guild.me.displayColor))
                .setTitle("Reminder")
                .setDescription(`${message.author}, your timer of **\`${ms(ms(timeuser), { long: true })}\`** is over. You wanted to be reminded of **\`${reason}\`**.`)
                .setTimestamp())
        }, ms(timeuser))
    }
}