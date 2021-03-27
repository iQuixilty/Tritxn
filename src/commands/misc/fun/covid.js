const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../../utils/utils')
const fetch = require('node-fetch')

module.exports = {
    name: "covid",
    category: "Misc",
    description: "Finds some statistics about COVID in your country",
    usage: "\`PREFIXcovid [country]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let countryName = (args[0])

        if (!countryName) {
            fetch('https://corona.lmao.ninja/v3/covid-19/all')
                .then(res => res.json())
                .then(d => {
                    let cases = d.cases.toLocaleString();
                    let recov = d.recovered.toLocaleString();
                    let deaths = d.deaths.toLocaleString();
                    const coronEmbed = new Discord.MessageEmbed()
                        .setAuthor('Worldwide Corona Statistics', 'https://miro.medium.com/max/3840/1*GDek9NTp5Ag77-4uCiivIQ.png')
                        .setColor(message.guild.me.displayColor)
                        .addFields(
                            { name: "Cases", value: cases },
                            { name: "Recovered", value: recov },
                            { name: "Deaths", value: deaths }

                        )
                        .setFooter('Stay Safe! Wash your hands')
                    message.channel.send(coronEmbed)
                });
        } else if (countryName) {

            fetch(`https://corona.lmao.ninja/v3/covid-19/countries/${countryName}`)
                .then(res => res.json())
                .then(d => {
                    let name = d.country
                    let flag = d.countryInfo.flag;
                    let cases1 = d.cases.toLocaleString();
                    let recov1 = d.recovered.toLocaleString();
                    let deaths1 = d.deaths.toLocaleString();
                    const coronEmbed1 = new Discord.MessageEmbed()
                        .setAuthor(`${name} Corona Statistics`, 'https://miro.medium.com/max/3840/1*GDek9NTp5Ag77-4uCiivIQ.png')
                        .setThumbnail(flag)
                        .setColor(message.guild.me.displayColor)
                        .addFields(
                            { name: "Cases", value: cases1 },
                            { name: "Recovered", value: recov1 },
                            { name: "Deaths", value: deaths1 }

                        )
                        .setFooter('Stay Safe! Wash your hands')
                    message.channel.send(coronEmbed1)
                }).catch(e => {
                    return message.channel.send('Error! Please provide a valid country')
                })
        }
    }
}
