const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')


const urban = require('urban');

module.exports = {
    name: "urban",
    category: "Misc",
    aliases: ["urb"],
    description: "Gives the definition of a word from urban dictionary",
    usage: "\`PREFIXurban [word]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const urbane = new Discord.MessageEmbed()
        if (args.length < 1) {
            message.react("👎");
            return message.channel.send(urbane.setColor(message.guild.me.displayColor).setDescription("**Please enter a word**"));
        } else {
            let word = args.join(" ");

            urban(word).first((json) => {
                if (!json) {
                    return message.channel.send(urbane.setColor(message.guild.me.displayColor).setDescription("**No such word exists!**"));
                }
                const def = new Discord.MessageEmbed()
                    .setTitle(json.word)
                    .setColor(message.guild.me.displayColor)
                    .setDescription(json.definition)
                    .addField("Upvotes", json.thumbs_up, true)
                    // .addField("Downvotes", json.thumb_down, true)
                    .setTimestamp(new Date())
                    .setFooter(`Written by ${json.author}`);

                message.channel.send(def);
            });
        }
    }
}