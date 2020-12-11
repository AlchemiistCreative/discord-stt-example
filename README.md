# discord-stt-example

Install these npm packages:
```
npm install discord.js discord-tts @google-cloud/speech @discordjs/opus
```
Add your Discord API token in config.json. 

You will need a Google API access.
```
process.env.GOOGLE_APPLICATION_CREDENTIALS = "your-google-credentials.json"
```
Add the relative path of your google credentials.
You can also put this value in a .env file
