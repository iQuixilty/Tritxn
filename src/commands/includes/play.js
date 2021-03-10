const ytdlDiscord = require("ytdl-core-discord");
const { canModifyQueue } = require("../../utils/vcUtil");

const { MessageEmbed } = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

module.exports = {
  async play(song, message) {
    let config;

    try {
      config = require("../../../config/config.json");
    } catch (error) {
      config = null;
    }

    const PLAY = new MessageEmbed()

    const PRUNING = config.PRUNING

    const queue = message.client.queue.get(message.guild.id);

    if (!song) {
      return queue.textChannel.send(PLAY.setColor(message.guild.me.displayColor).setDescription("**❌ Music queue ended.**")).catch(console.error);
    }

    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

    try {
      if (song.url.includes("youtube.com")) {
        stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return message.channel.send(PLAY.setColor(message.guild.me.displayColor).setTitle(`Error: ${error.message ? error.message : error}`));
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    const dispatcher = queue.connection
      .play(stream, { type: streamType })
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          // if loop is on, push the song back at the end of the queue
          // so it can repeat endlessly
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          // Recursively play the next song
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);

    try {
      var playingMessage = await queue.textChannel.send(PLAY.setColor(message.guild.me.displayColor).setDescription(`🎶 **Starting Playing: 🎶** \n\n[${song.title}](${song.url}) \n**[Requested By: <@${queue.requester}>]**`));
      await playingMessage.react("⏭");
      await playingMessage.react("⏯");
      await playingMessage.react("🔇");
      await playingMessage.react("🔉");
      await playingMessage.react("🔊");
      await playingMessage.react("🔁");
      await playingMessage.react("⏹");
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id === message.author.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);

      switch (reaction.emoji.name) {
        case "⏭":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.connection.dispatcher.end();
          queue.textChannel.send(PLAY.setColor(message.guild.me.displayColor).setDescription(`**${user} ⏩ skipped the song**`)).catch(console.error).then(msg => { msg.delete({ timeout: 10000 }) });
          collector.stop();
          break;

        case "⏯":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
            queue.textChannel.send(PLAY.setColor(message.guild.me.displayColor).setDescription(`**${user} ⏸ paused the music.**`)).catch(console.error).then(msg => { msg.delete({ timeout: 10000 }) });;
          } else {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
            queue.textChannel.send(PLAY.setColor(message.guild.me.displayColor).setDescription(`**${user} ▶ resumed the music!**`)).catch(console.error).then(msg => { msg.delete({ timeout: 10000 }) });;
          }
          break;

        case "🔇":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.volume <= 0) {
            queue.volume = 100;
            queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
            queue.textChannel.send(PLAY.setColor(message.guild.me.displayColor).setDescription(`**${user} 🔊 unmuted the music!**`)).catch(console.error).then(msg => { msg.delete({ timeout: 10000 }) });;
          } else {
            queue.volume = 0;
            queue.connection.dispatcher.setVolumeLogarithmic(0);
            queue.textChannel.send(PLAY.setColor(message.guild.me.displayColor).setDescription(`**${user} 🔇 muted the music!**`)).catch(console.error).then(msg => { msg.delete({ timeout: 10000 }) });;
          }
          break;

        case "🔉":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member) || queue.volume == 0) return;
          if (queue.volume - 10 <= 0) queue.volume = 0;
          else queue.volume = queue.volume - 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          queue.textChannel
            .send(PLAY.setColor(message.guild.me.displayColor).setDescription(`**${user} 🔉 decreased the volume, the volume is now ${queue.volume}%**`))
            .catch(console.error)
            .then(msg => { msg.delete({ timeout: 10000 }) });;
          break;

        case "🔊":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member) || queue.volume == 100) return;
          if (queue.volume + 10 >= 100) queue.volume = 100;
          else queue.volume = queue.volume + 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          queue.textChannel
            .send(PLAY.setColor(message.guild.me.displayColor).setDescription(`**${user} 🔊 increased the volume, the volume is now ${queue.volume}%**`))
            .catch(console.error)
            .then(msg => { msg.delete({ timeout: 10000 }) });;
          break;

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;
          queue.textChannel.send(PLAY.setColor(message.guild.me.displayColor).setDescription(`Loop is now ${queue.loop ? "**on**" : "**off**"}`)).catch(console.error).then(msg => { msg.delete({ timeout: 10000 }) });;
          break;

        case "⏹":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.songs = [];
          queue.textChannel.send(PLAY.setColor(message.guild.me.displayColor).setDescription(`**${user} ⏹ stopped the music!**`)).catch(console.error).then(msg => { msg.delete({ timeout: 10000 }) });
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (PRUNING === true || (PRUNING == "true") && playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch((e) => {
          return;
        });
      }
    });
  }
};
