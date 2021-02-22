const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const weather = require('weather-js')

module.exports = {
    name: "weather",
    category: "Misc",
    description: "Finds the weather of a zipcode/area",
    usage: "\`PREFIXweather [zipcode/area]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        weather.find({ search: args.join(" "), degreeType: 'F' }, function (error, result) {
            const weather = new Discord.MessageEmbed()

            if (error) return message.channel.send(weather.setColor(message.guild.me.displayColor).setTitle("There was an error, please only specify places!"))

            if (!args[0]) return message.channel.send(weather.setColor(message.guild.me.displayColor).setTitle('Please specify a location'))

            if (result === undefined) return message.channel.send(weather.setColor(message.guild.me.displayColor).setTitle('**Invalid** location'))

            var current = result[0].current;
            var location = result[0].location;

            const weatherinfo = new Discord.MessageEmbed()
                .setDescription(`**${current.skytext}**`)
                .setAuthor(`Weather forecast for ${current.observationpoint}`)
                .setThumbnail(current.imageUrl)
                .setColor(message.guild.me.displayColor)
                .addField('Timezone', `UTC${location.timezone}`, true)
                .addField('Degree Type', 'Farenheit', true)
                .addField('Temperature', `${current.temperature}°`, true)
                .addField('Wind', current.winddisplay, true)
                .addField('Feels like', `${current.feelslike}°`, true)
                .addField('Humidity', `${current.humidity}%`, true)


            message.channel.send(weatherinfo)
        })
    }
}