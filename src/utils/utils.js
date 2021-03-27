const { Message, User, MessageEmbed, GuildMember, PermissionResolvable, Guild, Collection, GuildChannel, Role, MessageAttachment } = require("discord.js");
const ms = require("ms")
const reactions = ['⏪', '◀️', '⏸️', '▶️', '⏩', '🔢']
const consoleColors = {
    "SUCCESS": "\u001b[32m",
    "WARNING": "\u001b[33m",
    "ERROR": "\u001b[31m"
}
let x = '```'
/**
 * Function to check if the user has passed in the proper arguments when using a command
 * @param {Message} message - The message to check the arguments for
 * @param {array} msgArgs - The arguments given by the user
 * @param {object[]} expectedArgs - The expected arguments for the command
 * @return {array} Returns the arguments array if all the arguments were as expected, else, returns `undefined/false`
 */
function processArguments(message, msgArgs, expectedArgs) {
    if (!Array.isArray(expectedArgs)) return log("WARNING", "src/utils/utils.js", "processArguments: expectedArgs has to be an array");

    let counter = 0;
    let amount, num, role, member, channel;

    for (const argument of expectedArgs) {
        if (typeof argument !== "object" || argument === null) return log("WARNING", "src/utils/utils.js", "processArguments: argument is not an object");

        if (!argument.type) return log("WARNING", "src/utils/utils.js", "processArguments: no argument type was provided");

        if (typeof argument.type !== "string") return log("WARNING", "src/utils/utils.js", "processArguments: argument type is not a string")

        amount = isNaN(argument.amount) ? 1 : (parseInt(argument.amount) <= 0 ? 1 : parseInt(argument.prompt))

        for (var i = 0; i < amount; i++) {
            switch (argument.type) {
                case "NUMBER":
                    num = Number(msgArgs[counter]);
                    if (!msgArgs[counter] || isNaN(num)) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    else msgArgs[counter] = num;
                    break;

                case "INTEGER":
                    if (isNaN(msgArgs[counter]) || isNaN(parseFloat(msgArgs[counter]))) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    msgArgs[counter] = parseInt(msgArgs[counter]);
                    break;

                case "CHANNEL":
                    if (!msgArgs[counter]) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    if (msgArgs[counter].startsWith("<#") && msgArgs[counter].endsWith(">")) msgArgs[counter] = msgArgs[counter].slice(2, -1)
                    channel = message.guild.channels.cache.get(msgArgs[counter]);
                    if (!channel) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    };
                    msgArgs[counter] = channel;
                    break;

                case "ROLE":
                    if (!msgArgs[counter]) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    if (msgArgs[counter].startsWith("<@&") && msgArgs[counter].endsWith(">")) msgArgs[counter] = msgArgs[counter].slice(3, -1)
                    role = message.guild.roles.cache.get(msgArgs[counter])
                    if (!role) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    msgArgs[counter] = role;
                    break;

                case "AUTHOR_OR_MEMBER":
                    if (msgArgs[counter] && (msgArgs[counter].startsWith("<@") || msgArgs[counter].startsWith("<@!") && msgArgs[coutner].endsWith(">"))) msgArgs[counter] = msgArgs[counter].replace("<@", "").replace("!", "").replace(">", "")
                    member = message.guild.member(msgArgs[counter])
                    if (!member) msgArgs[counter] = message.member
                    else msgArgs[counter] = member
                    if (argument.returnUsers) msgArgs[counter] = msgArgs[counter].user
                    break;

                case "ROLE_OR_MEMBER":
                    if (!msgArgs[counter]) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    if (msgArgs[counter].startsWith("<@&") && msgArgs[counter].endsWith(">")) msgArgs[counter] = msgArgs[counter].slice(3, -1)
                    role = message.guild.roles.cache.get(msgArgs[counter])
                    if (!role) {
                        if ((msgArgs[counter].startsWith("<@") || msgArgs[counter].startsWith("<@!") && msgArgs[coutner].endsWith(">"))) msgArgs[counter] = msgArgs[counter].replace("<@", "").replace("!", "").replace(">", "")
                        member = message.guild.member(msgArgs[counter])
                        if (!member) return msgArgs = { invalid: true, prompt: argument.prompt }
                        else msgArgs[counter] = member
                    } else msgArgs[counter] = role
                    break;

                case "SOMETHING":
                    if (!msgArgs[counter]) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    break;

                case "MEMBER":
                    if (!msgArgs[counter]) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    if ((msgArgs[counter].startsWith("<@") || msgArgs[counter].startsWith("<@!") && msgArgs[coutner].endsWith(">"))) msgArgs[counter] = msgArgs[counter].replace("<@", "").replace("!", "").replace(">", "")
                    member = message.guild.member(msgArgs[counter])
                    if (!member) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    else msgArgs[counter] = member
                    break;

                case "IMAGE":
                    if (message.attachments.array().length === 0) {
                        return msgArgs = { invalid: true, prompt: argument.prompt }
                    }
                    msgArgs[counter] = message.attachments.array()[0]
                    break;

                default:
                    return log("WARNING", "src/utils/utils.js", `processArguments: the argument type '${argument.type}' doesn't exist`);
            }
            counter++
        }
    }
    return msgArgs;
}

/**
 * Function to glocally blacklist a user
 * @param {Client} client - The client object (because the schemas are stored to it)
 * @param {string} userID - The ID of the user to whitelist 
 */
async function blacklist(client, userID) {
    if (client.BlacklistCache.has(userID)) return
    await client.DBConfig.findByIdAndUpdate('blacklist', { $push: { 'blacklisted': userID } }, { new: true, upsert: true, setDefaultsOnInsert: true })
    client.BlacklistCache.add(userID)
}

/**
 * Function to globally whitelist a previously blacklisted user
 * @param {Client} client - The client object (because the schemas are stored to it)
 * @param {string} userID - The ID of the user to whitelist 
 */
async function whitelist(client, userID) {
    if (!client.BlacklistCache.has(userID)) return
    await client.DBConfig.findByIdAndUpdate('blacklist', { $pull: { 'blacklisted': userID } }, { new: true, upsert: true, setDefaultsOnInsert: true })
    client.BlacklistCache.delete(userID)
}
/**
 * Function to automatically send paginated embeds and switch between the pages by listening to the user reactions
 * @param {Message} message - Used to send the paginated message to the channel, get the user, etc.
 * @param {MessageEmbed[]} embeds - The array of embeds to switch between
 * @param {object} [options] - Optional parameters
 * @param {number} [options.time] - The max time for createReactionCollector after which all of the reactions disappear
 * @example Examples can be seen in `src/utils/utils.md`
 */
async function paginate(message, embeds, options) {
    try {
        const pageMsg = await message.channel.send({ embed: embeds[0] });

        for (const emote of reactions) {
            await pageMsg.react(emote);
            await delay(750);
        }

        let pageIndex = 0;
        let time = 30000;
        const filter = (reaction, user) => {
            return reactions.includes(reaction.emoji.name) && user.id === message.author.id;
        };

        if (options) {
            if (options.time) time = options.time
        };

        const collector = pageMsg.createReactionCollector(filter, { time: time });
        collector.on('collect', async (reaction, user) => {
            reaction.users.remove(user).catch((e) => {
                message.channel.send(new MessageEmbed()
                    .setColor(message.guild.me.displayColor)
                    .setDescription(x + 'js' + `\n${e}` + x)
                    .setFooter(`If this error occurs again, please inform Qzxy#4227`))
            })
            if (reaction.emoji.name === '⏩') {
                pageIndex = embeds.length - 1
                await pageMsg.edit({ embed: embeds[pageIndex] })
            } else if (reaction.emoji.name === '▶️') {
                if (pageIndex < embeds.length - 1) {
                    pageIndex++
                    await pageMsg.edit({ embed: embeds[pageIndex] })
                } else {
                    pageIndex = 0
                    await pageMsg.edit({ embed: embeds[pageIndex] })
                }
            } else if (reaction.emoji.name === '⏸️') {
                await pageMsg.delete()
            } else if (reaction.emoji.name === '⏪') {
                pageIndex = 0
                await pageMsg.edit({ embed: embeds[pageIndex] })
            } else if (reaction.emoji.name === '◀️') {
                if (pageIndex > 0) {
                    pageIndex--
                    await pageMsg.edit({ embed: embeds[pageIndex] })
                } else {
                    pageIndex = embeds.length - 1
                    await pageMsg.edit({ embed: embeds[pageIndex] })
                }
            } else if (reaction.emoji.name === '🔢') {
                let num = await getReply(message, { time: 7500, regexp: /^\d+$/ })
                if (!num) return;

                num = parseInt(num.content)

                if (num > embeds.length) num = embeds.length - 1
                else num--

                pageIndex = num

                await pageMsg.edit({ embed: embeds[pageIndex] })
            }
        });

        collector.on('end', async () => {
            try {
                await pageMsg.reactions.removeAll()
            } catch (e) {
                return;
            }
        });
    } catch (e) {
        return;
    }
}

/**
 * Function to await a reply from a specific user.
 * @param {Message} message - The message to listen to
 * @param {object} [options] - Optional parameters
 * @param {number} [options.time] - The max time for awaitMessages 
 * @param {User} [options.user] - The user to listen to messages to
 * @param {String[]} [options.words] - Optional accepted words, will aceept any word if not provided
 * @param {RegExp} [options.regexp] - Optional RegExp to accept user input that matches the RegExp
 * @return {Promise<Message|Boolean>} Returns the `message` sent by the user if there was one, returns `false` otherwise.
 * @example const reply = await getReply(message, { time: 10000, words: ['yes', 'y', 'n', 'no'] })
 */
async function getReply(message, options) {
    let time = 30000
    let user = message.author
    let words = []
    if (options) {
        if (options.time) time = options.time
        if (options.user) user = options.user
        if (options.words) words = options.words
    }
    const filter = msg => {
        return msg.author.id === user.id
            && (words.length === 0 || words.includes(msg.content.toLowerCase()))
            && (!options || !options.regexp || options.regexp.test(msg.content))
    }
    const msgs = await message.channel.awaitMessages(filter, { max: 1, time: time })
    if (msgs.size > 0) return msgs.first()
    return false
}

/**
 * Return an random integer between `min` and `max` (both inclusive)
 * @param {number} min - The lower bound
 * @param {number} max - The upper bound
 * @return {number}
 * @example const rand = randomRange(0, 10)
 */
function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Return a filtered string
 * @param {array} arr - The array of bad words
 * @param {message} message - The message you want to filter
 * @param {string} string - The message you want to replace the bad word with
 */
function filterOutWords(arr, message, replace) {
    let removedWords = [...arr]
    let content = message.split(' ')
    let newString;

    for (let i = 0; i < content.length; i++) {
        for (let j = 0; j < removedWords.length; j++) {
            if (content[i].includes(removedWords[j])) {
                content[i] = replace
            }
        }

        newString = content.join(' ')
    }
    return newString
}

/**
 * Returns a filtered string indiciating if filtered string contains contents of array
 * @param {array} arr - The array of bad words
 * @param {args} args - The message args of the message
 */
function filterMarkdownWords(arr, args) {
    let markdown = ['|', '*', '`', '_', '>', '~', ' ', '!', '^', '&', '(', ')', '[', ']', '<', '>', '@', '$', '#', '%', '-', '+']
    let rawContent = args.slice(0).join(' ')
    let rawChar = []
    let filteredChar = []

    for (let i = 0; i < rawContent.length; i++) {
        let charLength = rawContent[i].length
        for (let j = 0; j < charLength; j++) {
            let char = rawContent[i].charAt(j)
            rawChar.push(char)
        }
    }

    for (let k = 0; k < rawChar.length; k++) {
        for (let l = 0; l < markdown.length; l++) {
            if (rawChar[k] === markdown[l]) {
                rawChar[k] = ''
            }
        }

        if (rawChar[k] !== '') filteredChar.push(rawChar[k])
    }

    let result = filteredChar.join("")

    if (arr.some((a) => result.includes(a))) {
        return result
    }

    return result
}

/**
 * Function to set a timeout
 * @param {number} ms - Time to wait in milliseconds
 * @return {Promise}
 * @example await delay(5000)
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * @param {import('../typings.d').myClient} client
 * @param {import('../typings.d').Command} command - The command you want to set a cooldown for
 * @param {Message} message - The guild ID the command is executed in
 * @return {(number|undefined)}
 */
function getCooldown(client, command, message) {
    let guildInfo = client.guildInfoCache.get(message.guild.id);
    let cd = command.cooldown;
    if (guildInfo.commandCooldowns && guildInfo.commandCooldowns[command.name]) {
        let roles = Object.keys(guildInfo.commandCooldowns[command.name]);
        let highestRole = message.member.roles.cache.filter(role => roles.includes(role.id)).sort((a, b) => b.position - a.position).first();
        if (highestRole) cd = guildInfo.commandCooldowns[command.name][highestRole.id] / 1000;
    }
    cd = typeof cd === 'undefined' ? 3 : cd
    return cd;
}

/**
 * 
 * @param {import('../typings.d').myClient} client 
 * @param {import('../typings.d').Command} command 
 * @param {Message} message
 */
function setCooldown(client, command, message) {
    const cd = getCooldown(client, command, message);

    if (!cd) return;

    let cooldowns;
    if (typeof command.globalCooldown === 'undefined' || command.globalCooldown) {
        if (!client.globalCooldowns.has(command.name)) client.globalCooldowns.set(command.name, new Collection());
        cooldowns = client.globalCooldowns;
    } else {
        if (!client.serverCooldowns.has(message.guild.id)) client.serverCooldowns.set(message.guild.id, new Collection());
        cooldowns = client.serverCooldowns.get(message.guild.id);
        if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = cd * 1000;

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
}


/**
 * 
 * @param {import('../typings.d').myClient} client 
 * @param {import('../typings.d').Command} command 
 * @param {Message} message
 */
async function setSavedCooldown(client, command, message) {
    const cd = command.savedCooldown

    if (!cd) return;
    let userCache = await getUserCache(client, message.author.id)
    let commandSC = userCache.savedCooldowns || {}
    const savedCD = { commandSC: {} }
    savedCD.commandSC[command.name] = {}
    commandSC[command.name] = new Date().getTime()

    userCache = await client.DBUsers.findByIdAndUpdate(message.author.id, { $set: { savedCooldowns: commandSC } }, { new: true, upsert: true, setDefaultsOnInsert: true })
}

/**
 * Function to convert milliseconds into readable time
 * @param {Number} ms - The time in 
 * @return {String} Readable time as a string
 */
function msToTime(ms) {
    let day, hour, minute, seconds;
    seconds = Math.floor(ms / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return day ? (hour ? (`${day}d ${hour}h ${minute}m ${seconds}s`) : (minute ? (`${day}d ${minute}m ${seconds}s`) : (`${day}d ${seconds}s`))) :
        (hour ? (`${hour}h ${minute}m ${seconds}s`) : (minute ? (`${minute}m ${seconds}s`) : (`${seconds}s`)))
}

/**
 * Function to get all missing permissions of a GuildMember
 * @param {GuildMember} member - The guild member whose missing permissions you want to get
 * @param {String[]} perms - The permissions you want to check for
 * @return {String} Readable string containing all missing permissions
 */
function missingPermissions(member, perms) {
    const missingPerms = member.permissions.missing(perms)
        .map(str => `\`${str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())}\``)

    return missingPerms.length > 1 ?
        `${missingPerms.slice(0, -1).join(", ")} and ${missingPerms.slice(-1)[0]}` :
        missingPerms[0]
}

/**
 * Function to shorten down console logs
 * @param {import('../typings.d').myClient} client
 * @param {message} message - The message properties
 * @param {err} error - Error that was thrown
 */
function errorMessage(client, message, err) {
    message.channel.send(new MessageEmbed()
        .setColor(message.guild.me.displayColor)
        .setDescription(x + 'js' + `\n${err}` + x)
        .setFooter(`Contact Qzxy#4227 if this happens again`))
}

/**
 * @param {import('../typings.d').myClient} client 
 * @param {string} guildID 
 */
async function getGuildInfo(client, guildID) {
    let guildInfo = client.guildInfoCache.get(guildID);

    if (!guildInfo) {
        guildInfo = await client.DBGuild.findByIdAndUpdate(guildID, {}, { new: true, upsert: true, setDefaultsOnInsert: true });
        client.guildInfoCache.set(guildID, guildInfo);
    }

    return guildInfo;
}

/**
 * @param {import('../typings.d').myClient} client 
 * @param {string} guildID 
 */
async function getGuildSettings(client, guildID) {
    let guildSettings = client.guildSettingsCache.get(guildID);

    if (!guildSettings) {
        guildSettings = await client.DBSettings.findByIdAndUpdate(guildID, {}, { new: true, upsert: true, setDefaultsOnInsert: true });
        client.guildSettingsCache.set(guildID, guildSettings);
    }

    return guildSettings;
}


/**
 * @param {import('../typings.d').myClient} client 
 * @param {string} guildID 
 */
async function getGuildAudit(client, guildID) {
    let guildAudit = client.guildAuditCache.get(guildID);

    if (!guildAudit) {
        guildAudit = await client.DBAudit.findByIdAndUpdate(guildID, {}, { new: true, upsert: true, setDefaultsOnInsert: true });
        client.guildAuditCache.set(guildID, guildAudit);
    }

    return guildAudit;
}

/**
 * @param {import('../typings.d').myClient} client 
 * @param {string} guildID 
 */
async function getGuildLevels(client, guildID) {
    let guildLevels = client.guildLevelsCache.get(guildID);

    if (!guildLevels) {
        guildLevels = await client.DBLevels.findByIdAndUpdate(guildID, {}, { new: true, upsert: true, setDefaultsOnInsert: true });
        client.guildLevelsCache.set(guildID, guildLevels);
    }

    return guildLevels;
}

/**
 * @param {import('../typings.d').myClient} client 
 * @param {string} userID 
 */
async function getUserCache(client, userID) {
    let userCache = client.userCache.get(userID);

    if (!userCache) {
        userCache = await client.DBUsers.findByIdAndUpdate(userID, {}, { new: true, upsert: true, setDefaultsOnInsert: true });
        client.userCache.set(userID, userCache);
    }

    return userCache;
}


/**
 * Function to shorten down console logs
 * @param {('SUCCESS'|'WARNING'|'ERROR')} type - The type of log (SUCCESS, WARNING, ERROR)
 * @param {String} path - The path where the console log is coming from
 * @param {String} text - The message to be displayed
 */
function log(type, path, text) {
    console.log(`\u001b[0m\u001b[34m [${path}]\u001b[0m - ${consoleColors[type]}${text}\u001b[0m`)
}

module.exports = {
    processArguments, blacklist, whitelist, paginate, log,
    getReply, randomRange, delay, msToTime, missingPermissions,
    getCooldown, setCooldown, errorMessage, filterOutWords,
    filterMarkdownWords, getGuildInfo, getGuildAudit, getGuildLevels,
    getGuildSettings, getUserCache, setSavedCooldown
}
