const { MessageEmbed } = require('discord.js')

module.exports = {
	name: "nowplaying",
	description: "Displays information about the current playing song.",
	aliases: ["np"],
	usage: "",
	run: async (client, message) => {
        let serverQueue = client.queue.get(message.guild.id);
        
        if(!serverQueue) {
            message.channel.send(client.messages[client.lang].noQueue)
        } else {
            const bar = await client.player.createProgressBar(serverQueue);
            let embed = new MessageEmbed()
            .setColor('#40ff00')
            .setAuthor('正在播放 🎶')
            .setThumbnail(serverQueue.songs[0].thumbnail)
            .setDescription(`**[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})**\n\n \`${bar}\` \n\n\`指令使用者:\` ${serverQueue.songs[0].author}`)
            message.channel.send(embed);
        }
	}
}