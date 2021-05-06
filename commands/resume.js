module.exports = {
	name: "resume",
	description: "Pause the song",
	aliases: [],
	usage: "",
	run: async (client, message, args) => {
		let channel = message.member.voice.channel;
        let serverQueue = client.queue.get(message.guild.id);
        
        if(!channel) {
            message.channel.send(client.messages[client.lang].notInChannel)
        } else if(!serverQueue) {
            message.channel.send(client.messages[client.lang].noQueue)
        } else {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            message.channel.send(client.messages[client.lang].resumed)
        }
	}
}