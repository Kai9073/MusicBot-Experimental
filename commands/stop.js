module.exports = {
	name: "stop",
	description: "Stops and clears the server queue",
	aliases: ["clearqueue"],
	usage: "play <link/song title>",
	run: async (client, message, args) => {
		let channel = message.member.voice.channel;
        let serverQueue = client.queue.get(message.guild.id);
        
        if(!channel) {
            message.channel.send(client.messages[client.lang].notInChannel)
        } else if(!serverQueue) {
            message.channel.send(client.messages[client.lang].noQueue)
        } else {
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
            message.channel.send(client.messages[client.lang].stopped)
        }
	}
}