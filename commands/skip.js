module.exports = {
  name: "skip",
  description: "Skips playing song",
  aliases: ["next"],
  usage: "play <link/song title>",
  run: async (client, message, args) => {
    let channel = message.member.voice.channel;
    let serverQueue = client.queue.get(message.guild.id);

    if (!channel) {
      message.channel.send(client.messages[client.lang].notInChannel);
    } else if (!serverQueue) {
      message.channel.send(client.messages[client.lang].noQueue);
    } else {
      serverQueue.connection.dispatcher.end();
      message.channel.send(client.messages[client.lang].skipped);
    }
  },
};
