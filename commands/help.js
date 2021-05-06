const { MessageEmbed } = require('discord.js')

module.exports = {
	name: "help",
	description: "Command list",
	aliases: ["help"],
	usage: "",
	run: async (client,message) => {
		let commandList = []
		client.commands.forEach((command) => {
			const thisCmd = `\`${command.name}\` | ${command.description}`
			commandList.push(thisCmd)
		})
		commandList.sort()
            let embed = new MessageEmbed()
            .setColor('#40ff00')
            .setAuthor('指令列表')
            .setDescription(commandList.join("\n"))
            message.channel.send(embed);
	}
}