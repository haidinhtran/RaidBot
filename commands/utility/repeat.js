const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionsBitField } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Repeats a message every X hour(s)')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to repeat')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('hours')
        .setDescription('The number of hours between each repeated message')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The text channel where the message will be sent')
        .setRequired(true)),
  async execute (interaction) {
    console.log('alo: ', interaction.member.permissions)
    const message = interaction.options.getString('message')
    const hours = interaction.options.getInteger('hours')
    const channel = interaction.options.getChannel('channel')

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({
        content: 'I do not have permission to manage messages.',
        ephemeral: true
      })
    }

    setInterval(() => {
      channel.send(message)
    }, hours * 60 * 60 * 1000)

    return interaction.reply({
      content: `I will repeat the message every ${hours} hour(s).`,
      ephemeral: true
    })
  }
}
