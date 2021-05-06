/*const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "lyrics",
    aliases: ["l"],
    run: async(client, message, args) => {
        const serverQueue = client.queue.get(message.guild.id);
        const song = args.join(" ");
        if(!serverQueue) {
            if(!args[0]) {
                message.channel.send(client.messages[client.lang].noQuery.replace("%ACTION%", "send lyrics data"));
            }
        } else {
            const msg = await message.channel.send(client.messages[client.lang].gettingData);
            const results = await client.genius.songs.search(song);
            const lyrics = results[0];
            
            if(lyrics.lyrics().length < 2048) {
                let embed = new MessageEmbed()
                .setAuthor('genius.com', 'https://images.genius.com/8ed669cadd956443e29c70361ec4f372.1000x1000x1.png', 'https://genius.com/')
                .setTitle(`${lyrics.title} - ${lyrics.artist.name}`)
                .setThumbnail(lyrics.image)
                .setURL(lyrics.url)
                .setDescription(lyrics.lyrics())
                .setFooter('Powered by genius.com')
                .setColor('RED');
                msg.edit(embed)
            } else {
                const firstLyricsEmbed = new MessageEmbed()
                .setColor("RED")
                .setAuthor('genius.com', 'https://images.genius.com/8ed669cadd956443e29c70361ec4f372.1000x1000x1.png', 'https://genius.com/')
                .setTitle(`${lyrics.title} - ${lyrics.artist.name}`)
                .setThumbnail(lyrics.image)
                .setURL(lyrics.url)
                .setDescription(lyrics.lyrics().slice(0, 2048));
                const secondLyricsEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(lyrics.lyrics().slice(2048, lyrics.length))
                .setFooter('Powered by genius.com');
                msg.edit(firstLyricsEmbed);
                message.channel.send(secondLyricsEmbed);
            }
        }
    }
}*/