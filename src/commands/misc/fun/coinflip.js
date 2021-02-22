const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor



module.exports = {
    name: "coinflip",
    category: "Misc",
    aliases: ["cf"],
    description: "Flips a coin for you",
    usage: "\`PREFIXcoinflip\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const coin = [
            `nothing`,
            `heads`,
            `tails`,
        ];

        const index = Math.floor(
            Math.random() * (coin.length - 1) + 1
        );

        let result = (coin[index])
        const Embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle(`:coin: Coin flip :coin:`)
            .setDescription(`The coin was flipped and the result is **${result}** `);
        message.reply(Embed);
    }
}