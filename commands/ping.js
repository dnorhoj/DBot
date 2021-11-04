const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	emoji: ':ping_pong:',
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};