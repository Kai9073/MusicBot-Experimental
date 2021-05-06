const {
  MessageEmbed
} = require("discord.js");
const ytdl = require("discord-ytdl-core");
const ytpl = require("ytpl");

module.exports = class playlist {
  static async play(client, message, args) {
    console.log(client)
    let channel = message.member.voice.channel;
    let serverQueue = client.queue.get(message.guild.id);
    let plId = args[0].match(/(?<=list=)[^\&]*/)[0];
    if (!plId)
      return message.channel.send(
        ":negative_cross_mark: failed to find playlist."
      );

    if (!channel) {
      return message.channel.send(client.messages[client.lang].notInChannel);
    } else if (!args[0]) {
      message.channel.send(
        client.messages[client.lang].noQuery.replace("%ACTION%", "play")
      );
    } else {
      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: channel,
        connection: null,
        songs: [],
        encoderArgs: ["-af", "bass=g=20,dynaudnorm=f=200"],
        volume: 100,
        playing: true,
      };

      let song;


      const playlist = await ytpl(plId);
      const vidURLs = [];
      playlist.items.forEach((i) => {
        vidURLs.push(i.url);
      });

      message.channel.send(vidURLs.join("\n"),{split:true})
      vidURLs.forEach(async(videoURL) => {


        const data = client.util.resolveQuery(videoURL);
        console.log(data)

        if (data === 'ytvid') {
          try {
              const songInfo = await ytdl.getInfo(videoURL);
              song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
                duration: songInfo.videoDetails.lengthSeconds,
                thumbnail: songInfo.videoDetails.thumbnails[3].url,
                author: message.author.tag,
              };
          } catch (err) {
            console.error(err);
            channel.leave();
            client.queue.delete(message.guild.id);
            message.channel.send(client.messages[client.lang].error);
          }
        } else {
          return message.channel.send("error.");
        }

        if (!serverQueue) {
          client.queue.set(message.guild.id, queueConstruct);
          //message.channel.send("歌曲列表分析完畢, 正在播放");
          console.warn(song)
          queueConstruct.songs.push(song);

          try {
            (async () => {
              const connection = await channel.join();
              queueConstruct.connection = connection;
              client.player.play(message.guild, queueConstruct.songs[0],false);
            })()
          } catch (err) {
            console.error(err);
            return;
            message.channel.send(client.messages[client.lang].error);
          }
        } else {
          console.error(song)
          serverQueue.songs.push(song);
          let embed = new MessageEmbed()
            .setTitle("歌曲已加入歌曲列表!")
            .setThumbnail(song.thumbnail)
            .setColor("#40ff00")
            .setDescription(
              `[${song.title}](${song.url})\n\`長度:\` ${client.util.msToTime(
              "hh:mm:ss",
              song.duration * 1000
            )}`
            );
          //message.channel.send(embed);
        }
      })
    }
  }
};