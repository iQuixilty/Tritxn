const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { inspect } = require('util')
let x = '```'
const { errorMessage } = require('../../utils/utils')

/** 
 * @type {import('../../typings.d').Command}
*/

module.exports = {
    name: "eval",
    category: "Owner",
    aliases: ["compile", 'evaluate'],
    canNotDisable: true,
    ignoreDisabledChannels: true,
    hideCommand: true,
    description: "Evaluate an expression",
    usage: "\`PREFIXeval [code]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const embed = new Discord.MessageEmbed()

        if (message.author.id !== '751606134938402866') {
            return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription("**You don't have permission to use this command**"))
        }

        const code = args.join(' ')
        if (!code) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription("**What are you trying to evaluate**"))

        try {
            const result = await eval(code)
            let output = result

            if (typeof result !== 'string') {
                output = inspect(result)
            }

            message.channel.send(embed.setColor(message.guild.me.displayColor).setAuthor(`Evaluated Expression`, message.author.displayAvatarURL({ dynamic: true })).setDescription(x + 'js' + `\n${output}` + x)).catch((e) => { return })
        } catch (error) {
            message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(x + 'js' + `\n${error}` + x)).catch((e) => { return })
        }

    }
}

