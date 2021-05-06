const { MessageEmbed } = require('discord.js');
const ytdl = require('discord-ytdl-core');
const ytsr = require('youtube-sr');
const spotify = require('spotify-url-info');

module.exports = {
	name: "play",
	description: "Play any song from Youtube or Spotify",
	aliases: ["p"],
	usage: "play <link/song title>",
	run: async (client, message, args, manual = false) => {
		let channel = message.member.voice.channel;
		let serverQueue = client.queue.get(message.guild.id)
		let target = args.join(" ");
		
		if(!channel) { 
			return message.channel.send(client.messages[client.lang].notInChannel) 
		} else if(!args[0]) {
			message.channel.send(client.messages[client.lang].noQuery.replace("%ACTION%", "play"))
		} else {
			const queueConstruct = {
				textChannel: message.channel,
				voiceChannel: channel,
				connection: null,
				songs: [],
				encoderArgs: ['-af', 'bass=g=20,dynaudnorm=f=200'],
				volume: 100,
				playing: true
			}

			let song;

			const data = client.util.resolveQuery(args.join(" "))
			
			if(data.ytvid) {
				try {
					const songInfo = await ytdl.getInfo(args[0])
					song = {
						title: songInfo.videoDetails.title,
						url: songInfo.videoDetails.video_url,
						duration: songInfo.videoDetails.lengthSeconds,
						thumbnail: songInfo.videoDetails.thumbnails[3].url,
						author: message.author.tag
					}
				} catch(err) {
					console.error(err)
					channel.leave()
					client.queue.delete(message.guild.id)
					message.channel.send(client.messages[client.lang].error)
				}
			} else if(data.spotifyurl) {
				try {
					const spotifyData = await spotify.getData(args[0]);
					const result = await ytsr.search(spotifyData.name);
					const songInfo = await ytdl.getInfo(result[0].url);
					song = {
						title: songInfo.videoDetails.title,
						url: songInfo.videoDetails.video_url,
						duration: songInfo.videoDetails.lengthSeconds,
						thumbnail: songInfo.videoDetails.thumbnails[3].url,
						author: message.author.tag
					}
				} catch(err) {
					console.error(err)
					channel.leave()
					client.queue.delete(message.guild.id);
					message.channel.send(client.messages[client.lang].error)
				}
			} else if(data.soundcloudurl) {
				const soundcloudData = await client.soundClient.getSongInfo(args[0]);
				const result = await ytsr.search(soundcloudData.title, { limit: 1 });
				const songInfo = await ytdl.getInfo(result[0].url)
				song = {
					title: songInfo.videoDetails.title,
					url: songInfo.videoDetails.video_url,
					duration: songInfo.videoDetails.lengthSeconds,
					thumbnail: songInfo.videoDetails.thumbnails[3].url,
					author: message.author.tag
				}
			} else {
				try {
					const result = await ytsr.search(target, { limit: 1 });
					const songInfo = await ytdl.getInfo(result[0].url)
					song = {
						title: songInfo.videoDetails.title,
						url: songInfo.videoDetails.video_url,
						duration: songInfo.videoDetails.lengthSeconds,
						thumbnail: songInfo.videoDetails.thumbnails[3].url,
						author: message.author.tag
					}
				} catch(err) {
					console.error(err)
					channel.leave()
					client.queue.delete(message.guild.id)
					message.channel.send(client.messages[client.lang].error)
				}
			}

			if(!serverQueue) {

				client.queue.set(message.guild.id, queueConstruct)
				message.channel.send('歌曲列表分析完畢, 正在播放')

				queueConstruct.songs.push(song)

				try {
					const connection = await channel.join();
					queueConstruct.connection = connection;
					client.player.play(message.guild, queueConstruct.songs[0]);
				} catch(err) {
					console.error(err);
					client.queue.delete(message.guild.id);
					channel.leave();
					message.channel.send(client.messages[client.lang].error);
				}
			} else {
				serverQueue.songs.push(song)
				let embed = new MessageEmbed()
				.setTitle('歌曲已加入歌曲列表!')
				.setThumbnail(song.thumbnail)
				.setColor('#40ff00')
				.setDescription(`[${song.title}](${song.url})\n\`長度:\` ${client.util.msToTime('hh:mm:ss', song.duration * 1000)}`)
				message.channel.send(embed)
			}
		}
	}
}