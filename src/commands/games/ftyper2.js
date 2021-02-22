const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const txtgen = require('txtgen')
const ms = require('ms')
const inGame = new Set()

module.exports = {
    name: "ftyper2",
    category: "Games",
    aliases: ["fasttyper2", 'ft2'],
    description: "Start a game of a much harder fast typer",
    usage: "\`PREFIXftyper2\`",
    perms: ['ADMINISTRATOR'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
   

        const filter = m => m.author.id === message.author.id
        if (inGame.has(message.author.id)) return
        inGame.add(message.author.id)
        for (i = 0; i < 16; i++) {
            const time = Date.now()
            let sentence = ''
            let ogSentence = txtgen.sentence().toLowerCase().split('.').join('').split(',').join('')
            ogSentence.split(' ').forEach(argument => {
                sentence += '' + argument.split('').join('') + ' '
            })
            message.channel.send(`${message.author}`)
            message.channel.send(new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setDescription(`**Write the following message (you have 20 seconds!)**: \n\`\`\`${sentence}\`\`\``))
            try {
                msg = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 20000,
                    errors: ['time']
                })
            } catch (ex) {
                message.channel.send(message.author)
                message.channel.send(new Discord.MessageEmbed().setColor('RED').setDescription('**Time\'s up!**'))
                inGame.delete(message.author.id)
                break
            }
            if (['cancel', 'end'].includes(msg.first().content.toLowerCase().trim())) {
                message.channel.send(new Discord.MessageEmbed().setColor('RED').setDescription('**Ended!**'))
                inGame.delete(message.author.id)
                break
            } else if (msg.first().content.toLowerCase().trim() === ogSentence.toLowerCase()) {
                message.channel.send(new Discord.MessageEmbed().setColor('GREEN').setDescription(`**Good job!\nIt took you ${ms(Date.now() - time, { long: true })} to type it!**`))
            } else {
                message.channel.send(new Discord.MessageEmbed().setColor('RED').setDescription('**You failed!**'))
                inGame.delete(message.author.id)
                break
            }

            if (i === 15) {
                message.channel.send(new Discord.MessageEmbed().setColor('GREEN').setDescription('**Dam, you are good at this, nice job!**'))
                inGame.delete(message.author.id)
                break
            }
        }
    }
}