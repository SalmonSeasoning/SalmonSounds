const Discord = require("discord.js");
const client = new Discord.Client();
//gotta import that fancy config file
const config = require("./config.json")['configuration'];

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  if (config['custom-game'] == "") {
    client.user.setGame(config['prefix'] + "help");
  } else {
    client.user.setGame(config['custom-game']);
  }
  console.log('SalmonSounds bot is successfully up and running!');
});
client.on("disconnect", () => {
  console.log('Disconnected!');
});
client.on("reconnecting", ()=>{
  console.log('Attempting to reconnect.');
});

client.on("guildCreate", (guild) => {
  if(guild.available){
    guild.defaultChannel.send('Hi! I am SalmonSounds!');
  }
});

client.on("message", (message) => { //eww these indents suck but i'm too lazy to change the setting
  if (message.content.startsWith(config["prefix"] + "voice")) {
    if (message.member.voiceChannel) {
      message.channel.send("You are in the voice channel " + message.member.voiceChannel.name);
      if (message.member.voiceChannel.joinable) {
        var parser = message.content.split(" "), parsed = [];
        for (var i = 0; i <= parser.length; i++) {
          if (i >= 1) {
          	parsed.push(parser[i]);		//Horrible parser because javascript sucks
          }
        }
        parsed = parsed.join(" ");
        parsed = parsed.substring(0, parsed.length - 1);

        //Parser debug
        message.channel.send(parsed);

        message.member.voiceChannel.join().then((connection) => {
          connection.playFile(parsed).on("end", ()=> {connection.disconnect();});
        });
      }
    }
  }

  if(message.content == config['prefix'] + 'invite'){
    message.channel.send('Here, join our server! ' + config['guild-invite-link']);
  }
  if (message.content.toLowerCase() == config["prefix"] + "disconnect") {
  	if (message.guild.voiceConnection) {
  		message.guild.voiceConnection.dispatcher.end();
  	} else {
  		message.reply("I am not in a voice channel!");
    }
	}

});

client.login(config['token']);
