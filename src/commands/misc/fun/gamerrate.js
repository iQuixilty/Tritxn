const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor



module.exports = {
    name: "gamerrate",
    category: "Misc",
    aliases: ["grate", "gamerate"],
    description: "Rates you or a user on how much of a gamer they are",
    usage: "\`PREFIXgamerrate [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const user = message.mentions.members.first();
        let gamerE = new Discord.MessageEmbed()


        const gamer = Math.floor(Math.random() * 101);
        gamerE.setColor(message.guild.me.displayColor)
        gamerE.setTitle(`${user ? "They are" : "You are"} ${gamer}% a gamer`);
        message.channel.send(gamerE);
    }
}