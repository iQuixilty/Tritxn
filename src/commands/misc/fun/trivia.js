const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

module.exports = {
    name: "trivia",
    category: "Misc",
    aliases: ["triv", 'tri'],
    description: "Gives a fun trivia question for you too answer",
    usage: "\`PREFIXtrivia\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let questions = [
            {
                title: "How many soccer players should each team have on the field at the start of the match?",
                options: ["12", "9", "11", "8"],
                correct: 3,
                difficulty: "`Easy`",
                category: "`Sports`"
            },
            {
                title: "Is Java a type of a OS?",
                options: ["Yes", "No"],
                correct: 2,
                difficulty: "`Easy`",
                category: "`Coding`"
            },
            {
                title: "Which part of the atom has no eletric charge?",
                options: ["Nucleus", "Electron", "Proton", "Neutron"],
                correct: 4,
                difficulty: "`Medium`",
                category: "`Science`"

            },
            {
                title: "What is meteorology the study of?",
                options: ["Meteors", "Weather", "Hotdogs", "Meteorites"],
                correct: 2,
                difficulty: "`Medium`",
                category: "`General Knowlegde`"
            },
            {
                title: "Best programming language?",
                options: ["JavaScript/TypeScript", "HTML", "Ruby", "Rust"],
                correct: 1,
                difficulty: "`Easy`",
                category: "`Coding`"
            },
            {
                title: "Best NPM package?",
                options: ["int.engine", "ms", "ws", "discord.js"],
                correct: 3,
                difficulty: "`Easy`",
                category: "`Coding`"
            },
            {
                title: "What's the first car that ever existed?",
                options: ["Benz Patent Motor Car", "Audi", "Gasoline-powered automobile", "1924 Doble Model E"],
                correct: 1,
                difficulty: "`Hard`",
                category: "`Engineering`"
            },
            {
                title: "When was discord in intial release?",
                options: ["2014", "2015", "2016", "2017"],
                correct: 2,
                difficulty: "`Medium`",
                category: "`Games`"
            },
            {
                title: "In what year were the first Air Jordan sneakers released?",
                options: ["1984", "1986", "1997", "2000"],
                correct: 1,
                difficulty: "`Hard`",
                category: "`General Knowledge`"
            },
            {
                title: "In a website browser address bar, what does “www” stand for?",
                options: ["World Wide Web", "World Wide", "nothing"],
                correct: 1,
                difficulty: "`Easy`",
                category: "`General Knowledge`"
            },
            {
                title: "What is the rarest M&M color?",
                options: ["Orange", "Yellow", "Red", "Brown"],
                correct: 4,
                difficulty: "`Medium`",
                category: "`General Knowledge`"
            },
            {
                title: "According to Greek mythology who was the first woman on earth?",
                options: ["Pandora", "Emma", "Gresh", "Ashe"],
                correct: 1,
                difficulty: "`Medium`",
                category: "`Mythology`"
            },
            {
                title: "What is the tiny piece at the end of a shoelace called?",
                options: ["An let", "An aglet", "Just design", "Nothing"],
                correct: 2,
                difficulty: "`Medium`",
                category: "`General Knowledge`"
            },
            {
                title: "What color eyes do most humans have?",
                options: ["Blue", "Green", "Brown", "White"],
                correct: 3,
                difficulty: "`Medium`",
                category: "`General Knowledge`"
            },
            {
                title: "In which city was Anne Frank’s hiding place?",
                options: ["Denhaag", "Amsterdam", "Utrecht", "Poland"],
                correct: 2,
                difficulty: "`Hard`",
                category: "`WW2 Facts`"
            },
            {
                title: "What is the lowest army rank of a US soldier?",
                options: ["Private", "Recruit"],
                correct: 1,
                difficulty: "`Easy`",
                category: "`Military`"
            },
            {
                title: "What is the highest-grossing film of all time without taking inflation into account?",
                options: ["Titanic", "Avengers Endgame", "Avatar", "Star Wars: The Force Awakens"],
                correct: 2,
                difficulty: "`Medium`",
                category: "`Movies and Shows`"
            },
            {
                title: "What was the first original Disney song to win an Academy Award for Best Original Song?",
                options: ["Someday My Prince Will Come", "Circle of Life", "Beauty and the Beast", "When You Wish Upon a Star"],
                correct: 4,
                difficulty: "`Medium`",
                category: "`Movies and Shows`"
            },
            {
                title: "What is Harry Potter’s patronus?",
                options: ["A horse", "An otter", "A hare", "A stag"],
                correct: 4,
                difficulty: "`Medium`",
                category: "`Movies and Shows`"
            },
            {
                title: "Who dies during the third Tri-wizard Tournament?",
                options: ["Viktor Krum", "Cedric Diggory", "Fleur Delacour", "Cormac McLaggen"],
                correct: 2,
                difficulty: "`Medium`",
                category: "`Movies and Shows`"
            },
            {
                title: "What are the three names of Daenerys’ dragons?",
                options: ["Dragon, Vision, and Regal", "Drogon, Viscer, and Rhegela", "Drogon, Viserion, and Rhaegal"],
                correct: 3,
                difficulty: "`Hard`",
                category: "`Movies and Shows`"
            },
        ];

        let q = questions[Math.floor(Math.random() * questions.length)];
        let i = 0;
        const TEmbed = new Discord.MessageEmbed()
            // .setTitle(q.title)
            .setAuthor(`${message.author.username}'s trivia question`, message.author.displayAvatarURL())
            .setDescription(`**${q.title}**` + '\n*You have 10 seconds to answer with the correct number.*\n\n' +
                q.options.map((opt) => {
                    i++;
                    return `\n${i}) ${opt}`
                }).join(" ")
            )
            .addField('Difficulty', q.difficulty, true)
            .addField('Group', q.category, true)
            .setColor('RANDOM')
            .setFooter(`Use the number of the correct answer`);
        message.channel.send(TEmbed);

        const tembed = new Discord.MessageEmbed()
        try {
            let msgs = await message.channel.awaitMessages(
                (u2) => u2.author.id === message.author.id,
                { time: 10000, max: 1, errors: ["time"] }
            );
            if (parseInt(msgs.first().content) == q.correct) {
                return message.channel.send(tembed.setColor(0x1BE80E).setTitle(`You got it correct!`));
            } else {
                return message.channel.send(tembed.setColor(0xE8360E).setTitle(`You got it incorrect. The answer was #${q.correct}!`));
            }
        } catch (e) {
            return message.channel.send(tembed.setColor(0xE8360E).setTitle(`You did not answer!`));
        }
    }
}