const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Hỏi thăm sức khỏe của Thiên Đạo'),
  async execute (interaction) {
    await interaction.reply({
      content: 'https://media.discordapp.net/attachments/1136195252819066903/1136258906251874384/nhan_loai_ngu_xuan.png?width=514&height=514',
      ephemeral: true
    })
  }
}
