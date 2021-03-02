const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')


/** 
 * @type {import('../../typings.d').Command}
*/

module.exports = {
    name: "highlight",
    category: "Utility",
    aliases: ["hl", "highlights"],
    description: "Allows you to highlight words so that when are are said, it will DM you",
    usage: "- \`PREFIXhighlight\` to display the words you have highlighted\n- \`PREFIXhighlight [set/remove] [word/phrase]\` to set/remove words.",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    canNotDisable: true,
    ignoreDisabledChannels: true,
    execute: async function (client, message, args) {
        const guildId = message.guild.id
        const userId = message.author.id

        const results = await client.DBHighlight.findOne({
            guildId,
            userId,
        })

        const hlE = new Discord.MessageEmbed()


        let setting = args[0]

        if (results === null && !setting) {
            return message.channel.send(new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setTitle(`Highlighted Words`)
                .setDescription(`You have not highlighted any words in this server`)
                .setTimestamp())
        } else if (!setting) {
            const hlwords = results.highlightedWords
            hlE
                .setColor(message.guild.me.displayColor)
                .setTitle('Highlighted Words')
                .setDescription(hlwords.length === 0 ? 'You have not highlighted any words in this server!' : '\`' + hlwords.join('\`, \`') + '\`')
                .setTimestamp()
            return message.channel.send(hlE)
        } else {
            const setE = new Discord.MessageEmbed()
            let word = args.slice(1).join(' ')

            switch (args[0]) {
                case 'set':
                    if (results !== null) {
                        if (results.highlightedWords.includes(word)) {
                            return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**You already have the word(s) \`${word}\` highlighted**`))
                        }
                    }

                    await client.DBHighlight.findOneAndUpdate({ guildId, userId }, { guildId, userId, $push: { highlightedWords: word.toLowerCase() } }, { upsert: true })

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**You will be notified when the word(s) \`${word}\` is used**`))
                    break;
                case 'remove':
                    if (results === null || !results.highlightedWords.includes(word)) return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**You dont have the word(s) \`${word}\` highlighted**`))

                    await client.DBHighlight.findOneAndUpdate({ guildId, userId }, { guildId, userId, $pull: { highlightedWords: word.toLowerCase() } }, { upsert: true })

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**You wont be notified when the word(s) \`${word}\` is used**`))
                    break;
                default:
                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        }

    }
}
