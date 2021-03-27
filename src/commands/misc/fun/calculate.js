const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../../utils/utils')

module.exports = {
    name: "calculate",
    category: "Misc",
    aliases: ["calc"],
    description: "Calculates some simple arithmetic",
    usage: `- \`PREFIXcalculate [num1] + [num2]\` to add two numbers
            - \`PREFIXcalculate [num1] - [num2]\` to subtract two numbers
            - \`PREFIXcalculate [num1] * [num2]\` to multiply two numbers
            - \`PREFIXcalculate [num1] / [num2]\` to divide two numbers`,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let num1 = Number(args[0])
        let num2 = Number(args[2])

        let prop = args[1]

        const math = new Discord.MessageEmbed()

        if (isNaN(num1)) return message.channel.send(math.setColor('#EB1322').setTitle(`Calculator`).addField("Input:", `\`None.\``).addField("Output:", `\`Please specify only numbers in the calculator.\``).setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/GNOME_Calculator_icon_2018.svg/250px-GNOME_Calculator_icon_2018.svg.png'))
        if (isNaN(num2)) return message.channel.send(math.setColor('#EB1322').setTitle(`Calculator`).addField("Input:", `\`None.\``).addField("Output:", `\`Please specify only numbers in the calculator.\``).setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/GNOME_Calculator_icon_2018.svg/250px-GNOME_Calculator_icon_2018.svg.png'))

        if (!args[0]) return message.channel.send(math.setColor('#EB1322').setTitle(`Calculator`).addField("Input:", `\`None.\``).addField("Output:", `\`You did not specify the first number!\``).setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/GNOME_Calculator_icon_2018.svg/250px-GNOME_Calculator_icon_2018.svg.png'))
        if (!args[1]) return message.channel.send(math.setColor('#EB1322').setTitle(`Calculator`).addField("Input:", `\`None.\``).addField("Output:", `\`You did not specify an operator, your options are +, -, * and /!\``).setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/GNOME_Calculator_icon_2018.svg/250px-GNOME_Calculator_icon_2018.svg.png'))
        if (!args[2]) return message.channel.send(math.setColor('#EB1322').setTitle(`Calculator`).addField("Input:", `\`None.\``).addField("Output:", `\`You did not specify the first number!\``).setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/GNOME_Calculator_icon_2018.svg/250px-GNOME_Calculator_icon_2018.svg.png'))

        if (prop === "+") {
            let doMath = num1 + num2
            message.channel.send(math.setColor('#2F3136').setTitle(`Calculator`).setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/GNOME_Calculator_icon_2018.svg/250px-GNOME_Calculator_icon_2018.svg.png').addField("Input:", `\`${num1} + ${num2}   \``).addField("Output:", `\`${doMath}      \``))

        }
        if (prop === "-") {
            let doMath = num1 - num2
            message.channel.send(math.setColor('#2F3136').setTitle(`Calculator`).setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/GNOME_Calculator_icon_2018.svg/250px-GNOME_Calculator_icon_2018.svg.png').addField("Input:", `\`${num1} - ${num2}   \``).addField("Output:", `\`${doMath}      \``))

        }
        if (prop === "*") {
            let doMath = num1 * num2
            message.channel.send(math.setColor('#2F3136').setTitle(`Calculator`).addField("Input:", `\`${num1} * ${num2}   \``).addField("Output:", `\`${doMath}      \``).setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/GNOME_Calculator_icon_2018.svg/250px-GNOME_Calculator_icon_2018.svg.png'))

        }
        if (prop === "/") {
            let doMath = num1 / num2
            message.channel.send(math.setColor('#2F3136').setTitle(`Calculator`).addField("Input:", `\`${num1} / ${num2}   \``).addField("Output:", `\`${doMath}      \``).setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/GNOME_Calculator_icon_2018.svg/250px-GNOME_Calculator_icon_2018.svg.png'))

        }
    }
}