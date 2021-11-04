const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { usernameToUUID, nameHistory, serverStatus } = require('../lib/minecraft');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('minecraft')
		.setDescription('Get minecraft related data')
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('profile')
				.setDescription('Get profile of minecraft player')
				.addStringOption(option => option
					.setName('username')
					.setDescription('Username of user')
					.setRequired(true))
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('server')
				.setDescription('Get info from minecraft server ip')
				.addStringOption(option => option
					.setName('ip')
					.setDescription('IP address of server')
					.setRequired(true))
				.addIntegerOption(option => option
					.setName('port')
					.setDescription('Server port (default: 25565)'))
		),
	emoji: '<:minecraft:905753879180886066>',
	async execute(interaction) {
		switch (interaction.options.getSubcommand()) {
			case 'profile':
				await interaction.deferReply();

				let username = interaction.options.getString('username');
				const uuid = await usernameToUUID(username);

				if (!uuid) return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setTitle('Error!')
							.setColor('RED')
							.setDescription('No user with that name was found.')
					]
				});

				const hist = await nameHistory(uuid);
				username = hist.at(-1).name;

				let profileLinks = [
					{ name: "NameMC", url: `https://namemc.com/profile/${uuid}` },
					{ name: "LABY.net", url: `https://laby.net/@${uuid}` }
				];

				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setTitle(`Minecraft profile - \`${username}\``)
							.setColor('GREEN')
							.addField(
								'Name history',
								hist.map((name, i) => `**${i + 1}** - \`${name.name}\``).reverse().join('\n'), // also i.changedToAt
								true
							)
							.addField(
								'Links',
								profileLinks.map(link => `[${link.name}](${link.url})`).join('\n'),
								true
							)
							.setThumbnail(`https://crafatar.com/avatars/${uuid}`)
							.setFooter(`UUID - ${uuid}`)
					]
				});

			case 'server':
				await interaction.deferReply();

				const ip = interaction.options.getString('ip');
				let port = interaction.options.getInteger('port');

				// Validate user input
				if (!port || port <= 0 || port > 65535) {
					port = 25565;
				}
				if (ip.length > 100) {
					return interaction.editReply("Please input a valid ip");
				}

				// Get server info
				const server = await serverStatus(ip, port);

				// Links
				const serverLinks = [
					{ name: "NameMC", url: `https://namemc.com/server/${ip}:${port}` },
					{ name: "LABY.net", url: `https://laby.net/server/${ip}:${port}` }
				];

				const serverStats = [
					{ name: 'More info', status: server.server.name },
					{ name: 'Online players', status: `${server.players.now}/${server.players.max}` }
				]

				let embed = new MessageEmbed()
					.setTitle(`Server status - \`${ip}` + ((port != 25565) ? `:${port}` : '') + '`')
					.setDescription(`Server ${(server.online) ? "Online" : "Offline"}`);

				if (server.online) {
					embed
						.setColor("GREEN")
						.setThumbnail(`https://eu.mc-api.net/v3/server/favicon/${ip}:${port}`)
						.addField('Status', serverStats.map(stat => `**${stat.name}** - \`${stat.status}\``).join('\n'), true)
						.addField('Links', serverLinks.map(link => `[${link.name}](${link.url})`).join('\n'), true);
					if (server.motd) embed.addField('Message of the Day', `\`\`\`${server.motd.trim()}\`\`\``);
				} else {
					embed.setColor("ORANGE");
				}

				return interaction.editReply({ embeds: [embed] })
		}
	},
};