const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "queue",
  description: "Shows the server queue",
  run: async (client, message, args) => {
    function getRequesterMention(index) {
      const uId = message.guild.members.cache.find(
        (member) =>
          member.user.tag ===
          client.queue.get(message.guild.id).songs[index + 1].author
      ).id;
      if (!uId) return "@InvalidUser";
      return `<@${uId}>`;
    }
    const serverQueue = client.queue.get(message.guild.id);
    const channel = message.member.voice.channel;

    if (!channel) {
      message.channel.send(client.messages[client.lang].notInChannel);
    } else if (!serverQueue) {
      message.channel.send(client.messages[client.lang].noQueue);
    } else {
      const timeElapsed = client.player.getTime(
        client.queue.get(message.guild.id)
      );
      const page = 1;
      const queue = serverQueue.songs.slice((page - 1) * 9 + 1, page * 9 + 1);
      const queuemsg = queue
        .map(
          (song, index) =>
            `\`${index + 1}.\` [${song.title || "?"}](${
              song.url
            }) (${client.player.getLength(
              serverQueue,
              index + 1
            )})\n\`  \` ${getRequesterMention(index)}`
        )
        .join("\n\n");
      let embed = new MessageEmbed()
        .setAuthor(
          message.guild.name + "的歌曲列表",
          message.guild.iconURL({ format: "png", dynamic: "true" })
        )
        .setDescription(
          `__正在播放:__\n[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})  \n\`${timeElapsed}\` \`[${serverQueue.songs[0].author}]\`\n
            ${queuemsg}`,
          { split: true }
        )
        .setColor("RED")
        .setFooter(
          `${serverQueue.songs.length - 1} songs in queue${
            serverQueue.songs.length >= 11
              ? ", showing first 9 songs in queue"
              : ""
          }`,
          message.author.displayAvatarURL({ dynamic: true, format: "png" })
        );
      message.channel.send(embed);
    }
  },
};
