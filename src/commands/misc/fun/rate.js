const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../../utils/utils')

module.exports = {
    name: "rate",
    category: "Misc",
    description: "Rates something",
    usage: "\`PREFIXrate [thing]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        const rate = new Discord.MessageEmbed()
        let answers = [
            //Postive
            "💯",
            "Yes",
            "Me likey",
            "👀",
            "😍😍",
            "He's cool yea",
            "She's cool yea",
            "uhhhh yes",
            "Indeed",
            "My favorite",
            "Pretty good",
            "Music to my ears",
            "Dreamy",
            "Cool",
            "At least it's not bad",
            "Not the best but still good",
            "AMAZING",
            "Dude, that's like, awesome",
            `oo thats nice`,
            `:flushed:`,
            "Underrated",

            //Negative
            "How about no",
            "Yeah no",
            "Needs much improvement",
            "Barely ok, in short it's shit",
            "💩 basically",
            "Just horrible",
            "Never ask me to rate that again",
            "Overrated",
            "Nobody wants to see that",
            "I disapprove",
            "I'm not allowed to say",
            "That's goodn't",
            "Oh no",
            "Very uhh, how do I say this without sounding rude",
            "Might as well throw it away",
            `This makes me wanna throw up`,
            `What!! tf is this`,
            `You better be joking. its disgusting`,
        ];

        let answer = answers[Math.floor(Math.random() * answers.length)];

        if (args[0]) {
            message.channel.send(rate.setColor(message.guild.me.displayColor).setDescription(`**${answer}**`));
        } else {
            message.channel.send(rate.setColor(message.guild.me.displayColor).setDescription("**Give me something to rate**"));
        }
    }
}