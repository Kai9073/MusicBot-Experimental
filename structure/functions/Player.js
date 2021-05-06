const ytdl = require("discord-ytdl-core");
const { MessageEmbed } = require("discord.js");

class Player {
  constructor(client) {
    this.client = client;
    this.Util = require("./Util");
  }

  play(guild, song, send = true) {
    const serverQueue = this.client.queue.get(guild.id);
    const encoderArgs = this.client.queue.encoderArgs;

    if (!song) {
      serverQueue.voiceChannel.leave();
      this.client.queue.delete(guild.id);
      return serverQueue.textChannel
        .send(this.client.messages[this.client.lang].finishedQueue)
        .catch((err) => console.log(err));
    }

    const stream = ytdl(song.url, {
      filter: "audioonly",
      opusEncoded: true,
      encoderArgs: encoderArgs,
    });

    const dispatcher = serverQueue.connection
      .play(stream, { type: "opus" })
      .on("finish", () => {
        serverQueue.songs.shift();
        this.client.player.play(guild, serverQueue.songs[0]);
      })
      .on("error", (error) => {
        console.log(error);
        serverQueue.voiceChannel.leave();
        this.client.queue.delete(guild.id);
        serverQueue.textChannel.send(this.client.messages[client.lang].error);
      });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
    let embed = new MessageEmbed()
      .setColor("#40ff00")
      .setTitle(`正在播放 :notes:`)
      .setThumbnail(song.thumbnail)
      .setDescription(
        `[${song.title}](${song.url})\n\`長度:\` ${this.Util.msToTime(
          "hh:mm:ss",
          song.duration * 1000
        )}\n\n\`下一首:\`${
          serverQueue.songs[1] ? serverQueue.songs[1].title : "(沒有)"
        }`
      );
    if(send) serverQueue.textChannel.send(embed);
  }

  createProgressBar(queue) {
    const streamTime = queue.connection.dispatcher.streamTime;
    const totalTime = queue.songs[0].duration * 1000;
    const index = Math.round((streamTime / totalTime) * 25);
    if (index >= 1 && index <= 25) {
      const bar = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬".split("");
      bar.splice(index, 0, "🔘");
      const time = this.Util.msToTime("hh:mm:ss", streamTime);
      return `${time} | ${bar.join("")} | ${this.Util.msToTime(
        "hh:mm:ss",
        queue.songs[0].duration * 1000
      )}`;
    } else {
      const time = this.Util.msToTime("hh:mm:ss", streamTime) || "00:00:00";
      return `${time} | 🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬ | ${
        this.Util.msToTime("hh:mm:ss", queue.songs[0].duration * 1000) ||
        "00:00:00"
      }`;
    }
  }

  getTime(queue) {
    const streamTime = queue.connection.dispatcher.streamTime || 0;
    const totalTime = queue.songs[0].duration * 1000 || 0;
    const index = Math.round((streamTime / totalTime) * 25) || 0;
    console.log(streamTime);
    console.log(totalTime);
    console.log(index);
    if (index >= 1 && index <= 25) {
      const bar = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬".split("");
      bar.splice(index, 0, "🔘");
      const time = this.Util.msToTime("hh:mm:ss", streamTime);
      return `${time} / ${this.Util.msToTime(
        "hh:mm:ss",
        queue.songs[0].duration * 1000
      )}`;
    } else {
      const time = this.Util.msToTime("hh:mm:ss", streamTime) || "00:00:00";
      return `${time} / ${
        this.Util.msToTime("hh:mm:ss", queue.songs[0].duration * 1000) ||
        "00:00:00"
      }`;
    }
  }

  getLength(queue, index) {
    const songLength = this.Util.msToTime(
      "hh:mm:ss",
      queue.songs[index].duration * 1000 || 0
    );
    return songLength;
  }
}

module.exports = Player;
