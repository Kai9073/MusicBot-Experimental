module.exports = {
	name: "pause",
	description: "Pause the song",
	aliases: [],
	usage: "",
	run: async (client, message) => {
		let channel = message.member.voice.channel;
        let serverQueue = client.queue.get(message.guild.id);
        
        if(!channel) {
            message.channel.send(client.messages[client.lang].notInChannel)
        } else if(!serverQueue) {
            message.channel.send(client.messages[client.lang].noQueue)
        } else {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause(true);
            message.channel.send(client.messages[client.lang].paused)
        }
	}
}