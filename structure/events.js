module.exports = function(client) {
    client.on('ready', () => {
        console.log('Bot is ready!')
    })
    client.on('message', async(message) => {
        if(message.author.bot) return;
        if(!message.guild) return;
        if(!message.content.startsWith("m!")) return;

        const args = message.content.slice('m!'.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if (cmd.length === 0) return;

        let command = client.commands.get(cmd);
      
        if (!command) command = client.commands.get(client.aliases.get(cmd));
        if (command) command.run(client, message, args);
    })
}