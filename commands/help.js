const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows an overview of commands!')
        .addStringOption(option => option
            .setName('command')
            .setDescription('Get help for specific command')
        ),
    emoji: ':information_source:',
    async execute(interaction) {
        const commands = interaction.client.commands;
        let specifiedCommand = interaction.options.getString('command');

        let embed = new MessageEmbed()
            .setColor("#8B9EF3")
            .setThumbnail("https://cdn.discordapp.com/avatars/456164445589340202/27759f1a625ccc94084841ade1c74c67.png?size=4096")
            .setFooter("Made by dnorhoj#1337", "https://cdn.discordapp.com/avatars/281409966579908608/a_e8326ab880de2ae1eaf0f7a960c94ffb.png?size=128");

        if (specifiedCommand) {
            specifiedCommand = specifiedCommand
                .replace('/', '')
                .toLowerCase();
            const command = commands.get(specifiedCommand);

            if (!command) {
                embed
                    .setTitle("Error")
                    .setDescription("Command not found!")
                    .setThumbnail('')
                    .setColor("RED");
            } else {
                embed
                    .setTitle(`Help for \`/${command.data.name}\``)
                    .setDescription(`${command.emoji} ${command.data.description}`);

                if (command.data.options.length > 0 && command.data.options[0].constructor.name == 'f') { // Check if command has subcommand
                    command.data.options.forEach(subCommand => {
                        console.log(subCommand);

                        let usage = `${command.data.name} ${subCommand.name}`

                        subCommand.options.forEach(option => {
                            usage += (option.required) ? ` [${option.name}]` : ` <${option.name}>`
                        })

                        embed.addField(
                            subCommand.name,
                            [
                                subCommand.description,
                                `Usage: \`/${usage}\``
                            ].join('\n')
                        )
                    });
                } else {
                    let usage = `${command.data.name}`

                    command.data.options.forEach(option => {
                        usage += (option.required) ? ` [${option.name}]` : ` <${option.name}>`
                    })

                    embed.addField('Usage', `\`/${usage}\``);
                }
            }
        } else {
            embed
                .setTitle("Commands")
                .setDescription("List of DBot's commands")

            commands.forEach(command => {
                embed.addField(
                    `${command.emoji} ${command.data.name}`,
                    command.data.description,
                    true
                )
            });
        }

        return interaction.reply({ embeds: [embed] });
    },
};