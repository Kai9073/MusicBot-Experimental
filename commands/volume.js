module.exports = {
    name: "volume",
    description: "Shows or sets the volume for the server",
    run: async(client, message, args) => {
        let serverQueue = client.queue.get(message.guild.id);
        let msg;
        let volume = JSON.stringify(serverQueue.volume)

        if(!args[0]) {
            msg = client.messages[client.lang].volume.replace("%VOLUME%", volume)
            message.channel.send(msg)
        } else if(!serverQueue) {
            message.channel.send(client.messages[client.lang].noQueue)
        } else {
            if(isNaN(args[0])) {
                message.channel.send(client.messages[client.lang].isNaN)
            } else if(args[0] > 100) {
                message.channel.send(client.messages[client.lang].moreThan100)
            } else {
                serverQueue.volume = args[0];
                serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100)
                msg = client.messages[client.lang].setVolume.replace("%VOLUME%", serverQueue.volume)
                message.channel.send(msg)
            }
        }
    }
}