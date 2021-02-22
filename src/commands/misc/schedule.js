const { MessageEmbed, Message, Collection, DiscordAPIError } = require("discord.js");

module.exports = {
    name: "schedule",
    category: "Misc",
    aliases: ["school"],
    description: "School Schedule",
    usage: "",
    examples: "\`PREFIXscedhule [day]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let day = args[0]

        const dayEmbed = new MessageEmbed()

        if (message.guild.id !== '796125520961994764') return;

        if (day.toLowerCase() === 'monday' || day.toLowerCase() === 'thursday') {
            return message.channel.send(dayEmbed
                .setColor(message.guild.me.displayColor)
                .setTitle('Monday/Thursday Schedule')
                .setDescription(`\`\`\`1st Period - 8:00 to 9:30\n\n2nd Period - 9:45 to 11:15\n\nLunch - 11:15 to 12:15\n\n3th Period - 12:15 to 1:45\n\n7th Period - 2:00 to 3:30\`\`\``))
        } else if (day.toLowerCase() === 'tuesday' || day.toLowerCase() === 'friday') {
            return message.channel.send(dayEmbed
                .setColor(message.guild.me.displayColor)
                .setTitle('Tuesday/Friday Schedule')
                .setDescription(`\`\`\`4th Period - 9:00 to 10:30\n\n5th Period - 10:45 to 12:15\n\nLunch - 12:15 to 1:15\n\nOffice Hours - 1:15 to 2:00\n\n6th Period - 2:00 to 3:30\`\`\``))
        } else if (day.toLowerCase() === 'wednesday') {
            return message.channel.send(dayEmbed
                .setColor(message.guild.me.displayColor)
                .setTitle('Wednesday Schedule')
                .setDescription(`\`\`\`Advisory - 9:00 to 10:00\n\nBreak - 10:00 to 10:15\n\nLearning Time - 10:15 to 12:00\n\nLunch - 12:00 to 1:00\n\nOffice Hours - 1:00 to 1:45\`\`\``))
        }
    }
}