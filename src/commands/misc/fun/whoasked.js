const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor



module.exports = {
    name: "whoasked",
    category: "Misc",
    description: "Who asked?",
    usage: "\`PREFIXwhoasked\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        message.delete()
        if (message.author.id !== '751606134938402866') {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setTitle("Leave the who asking too Qzxy")
            )
        }

        message.channel.send(
            new Discord.MessageEmbed()
                .setDescription("Now playing: \nWho Asked (Feat. Nobody Did) \n──────────────:white_circle: \n◄◄⠀▐▐⠀►► 3:56 / 𝟹:𝟻𝟼⠀───○ :loud_sound:"))
    }
}