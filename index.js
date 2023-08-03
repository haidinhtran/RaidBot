const fs = require('node:fs')
const path = require('node:path')
// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')
const { token } = require('./config.json')

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.commands = new Collection()

// Get the command files location following format /commands/folder/file
const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder)
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command)
    } else {
      console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`)
    }
  }
}

// Dynamic read command files

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return
  console.log(`interaction: ${interaction}`)

  const command = interaction.client.commands.get(interaction.commandName)
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }
  const privateErrorMessage = {
    content: 'There was an error while executing this command!',
    ephemeral: true
  }
  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    interaction.replied || interaction.deferred
      ? await interaction.followUp(privateErrorMessage)
      : await interaction.reply(privateErrorMessage)
  }
})

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
  console.info(`Ready! Logged in as ${c.user.tag}`)
})

// Log in to Discord with your client's token
client.login(token)
