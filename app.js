//Discord Wolfbot
const Discord = require("discord.js"); //Loads discord js library 

const client = new Discord.Client();

const config = require ("./config.json"); // Loads current directory config file 

const toDelete = [";;play", ";;np"]
const mutedUsers = [];

client.on("ready", () =>{    
    console.log('Logged in as')
    console.log(client.user.username)
    console.log(client.user.id)
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    console.log('-----------------------')

    client.user.setGame("Type !help");
})

client.on("guildCreate", () => {
    // This event triggers when the bot joins a guild.
    //Add Wolf interaction TODO
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`)
})

client.on("guildDelete", guild => {
    // this event triggers when the bot is removed from a guild.
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);    
  });

let userLastMessage; //Defined in a global scope in order to retain last message. See client.on("message", ...)

client.on("message", async message => {
    //This event triggers every time a message is sent.
    //Stops bots from issuing commands
    if(message.author.bot) return;
        
    //Check if message starts with !   
    if(message.content[0] !== "!")
    {        
        var args = message.content.split(/ +/g); 
        var command = "";                 
    }   
    else
    {       
        var args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        var command = args.shift().toLowerCase();    
    } 
    
    if(mutedUsers.includes(message.author)){
       return message.delete();
    }
   
    if (toDelete.includes(args[0])){        
        message.delete(500).catch(O_o => {});
    }

    if(command === "say"){  
        
        var sayMessage = args.join(" ");
        message.delete().catch(O_o => {});                                                          
        message.channel.send(sayMessage).catch(error => message.reply("Please provide content of the message e.g. !say <content>"));
         
    }   
    //console.log(message.channel.messages.findAll("reactions", )); 
   
    if(command === "purge"){
        const deleteCount = parseInt(args[0], 10);       

        if(!deleteCount || deleteCount < 2 || deleteCount > 100)
           return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

        const fetched = await message.channel.fetchMessages({count: deleteCount});
        message.channel.bulkDelete(fetched).catch(error => message.reply(`Couldn't delete messages because of: ${error}`));        
    }

    if (command === "clean"){
        if(!message.member.roles.some(r => ["ADMIN"].includes(r.name))){
            return message.reply("Sorry, You don't have permissions to use this!");
        };

        message.channel
        .bulkDelete(message.channel.messages
        .filter((r) => {return !r.reactions.has('✨');}))
        .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));                    
        
    }

    if(command === "hello"){
       return message.reply("Hi! :wolf:") 
    }

    if(command === "changes"){
       wolfbotVersion = `\nDiscord Wolfbot V. ${config.version}:\n\n`
       changes = "-New command: !private (check !help)"
       message.reply(wolfbotVersion + changes); 
    }    
    
    commands = {
        "help":"Displays this window",
        "say <content>":"Makes me say something",
        "changes":"Displays changes made to the bot",
        "hello":"Greets user",
        "clean <amount>":"Deletes messages between 2 and 100, and newer than two weeks", 
        "purge <amount>":"(Admin) Deletes messages that has not been cached by the bot",       
        "avatar <username>/@mention":"Get a user's avatar (Can only use one type of argument)", 
        "list":"(Admin) Shows list of the words to be deleted as first word in a message.",
        "mutedlist":"(Admin) Shows list of muted users which messages will be deleted.",
        "addlist <word>":"(Admin) Adds word to the list.",
        "dellist <word>":"(Admin) Deletes word from list",
        "chatmute <username>":"(Admin) Adds user to muted list", 
        "unmute <username>":"(Admin) Deletes user from muted list",
        "pm <username>/@mention ":"Send private message to user or group of users.(Can only use one type of argument)",
        "afk":"Moves user to afk channel(Only works on server with AFK channel)",
        "star <id>(optional)":"Stars a message in order to not be deleted when clean command is used",
        "private <id>(optional)":"sends last message to your dm"
    }

    if(command === "help"){
        if(args.length > 0){
            return message.reply("'help' command takes no arguments");
        }

        var arr = [];
        for(var key in commands){                                   
            //message.author.send("```fix\n" + key + " : " + commands[key] + "```\n");            
            await arr.push(key + " : " + commands[key] + "\n");         
        } 
        message.reply("Help has been sent! :wolf:");    
        message.author.send("```fix\n" + arr.toString().replace(/,/g, "") + "```\n");           
    }

    if(command === "addlist"){
        if(!message.member.roles.some(r => ["ADMIN"].includes(r.name)))
        {
            return message.reply("Sorry, You don't have permissions to use this!")
        }
        
        if(args.length < 2)
        {      
            if(!toDelete.includes(args[0])){      
            toDelete.push(args[0]); 
            message.author.send(`${args[0]} has been added to the list.`); 
            message.delete().catch(O_o => {}); 
            }
            else{
                return message.author.send(`${args[0]} Already in list`);
            }   
        }else{
            return message.reply("Provide only one argument");
        }        
    }

    if(command === "dellist"){
        if(!message.member.roles.some(r => ["ADMIN"].includes(r.name)))
        {
            return message.reply("Sorry, You don't have permissions to use this!")
        }

        if(args.length < 2)
        {
            if(toDelete.includes(args[0])){
            toDelete.splice(toDelete.indexOf(args[0]), 1);
            message.author.send(`${args[0]} has been removed from the list.`); 
            message.delete().catch(O_o => {}); 
            }else{
            return message.reply("Word is not in list");
            }
        }else{
            return message.reply("Provide only one argument");
        }        
    }

    if(command === "list"){
        if(!message.member.roles.some(r => ["ADMIN"].includes(r.name)))
        {
            return message.reply("Sorry, You don't have permissions to use this!");
        } 
        else if(args.length > 0)
        {
            return message.reply("'list' command takes no arguments");
        }

        message.author.send("```fix\nWords in list:\n" + toDelete.toString().replace(/,/g, " ") + "```");
    }
    
    if(command === "avatar"){        
        if(message.mentions.users.array().length > 0){
           return message.reply(message.mentions.users.map((user) => user.avatarURL));
        }   

        if(args.length < 2 && args.length > 0){            
            message.reply(message.client.users.find('username', args[0]).avatarURL);   
                 
        } else{
            message.reply("Please enter the desired username.");
        }                 
    }
    
    if(command === "chatmute"){
        if(!message.member.roles.some(r => ["ADMIN"].includes(r.name))){
            return message.reply("Sorry, You don't have permissions to use this!");
        }

        if(args.length > 0 && args.length < 2){
            mutedUsers.push(message.client.users.find('username', args[0]));            
        }
    }

    if (command === "unmute"){
        if(!message.member.roles.some(r => ["ADMIN"].includes(r.name))){
            return message.reply("Sorry, You don't have permissions to use this!");
        }

        if(args.length > 0 && args.length < 2){
            mutedUsers.splice( toDelete.indexOf(args[0]), 1);
        }
    }

    if (command === "mutedlist"){
        if(!message.member.roles.some(r => ["ADMIN"].includes(r.name))){
            return message.reply("Sorry, You don't have permissions to use this!");
        }
        else if(args.length > 0)
        {
            return message.reply("'list' command takes no arguments");
        }

        message.author.send("```fix\nUsers in list:\n" + mutedUsers.toString().replace(/,/g, " ") + "```");
    }

    if(command === "afk"){
       message.member.setVoiceChannel(message.guild.afkChannel);
    }

    if(command === "pm"){               
        if(message.mentions.users.array().length > 0){
            message.mentions.users.map((user) => user.send({
                embed : {
                    color: 12370112,
                    author: {
                      name: message.author.username,
                      icon_url: message.author.avatarURL,                  
                    }, 
                    description: args.slice(message.mentions.users.array().length).toString().replace(/,/g, " "),
                    timestamp: new Date()
                }            
            }))
            return message.delete();
        }      
        message.client.users.find('username', args[0]).send({
            embed : {
                color: 12370112,
                author: {
                  name: message.author.username,
                  icon_url: message.author.avatarURL,                  
                }, 
                description: args.slice(1).toString().replace(/,/g, " "),
                timestamp: new Date()
            }            
        })
    
        message.delete();
    }

    //Sets last message when message does not start with !star and !private    
    if (command != "star" && command != "private"){
        userLastMessage = message.author.lastMessage;        
    }
   
    if(command === "star"){
        if(args.length > 0 && args.length < 2){
            var m = message.channel.fetchMessage("" + args[0])            
            .then(m => {m.react("✨")});
            message.delete();
        }else{
            userLastMessage.react("✨").catch(error => {message.reply("No last message found")});
            message.author.lastMessage.delete(500);
        }
    }

    if(command === "private"){    
        if(args.length > 0 && args.length < 2){     
            message.channel.fetchMessage("" + args[0])            
            .then(message => message.author.send({
                embed : {
                    color: 12370112,
                    author: {
                      name: message.author.username,
                      icon_url: message.author.avatarURL,                  
                    }, 
                    description: message.content,
                    timestamp: new Date()
                }
            }));
            message.delete(500);
        }
        else if(args.length == 0) {
            message.author.send({
                embed : {
                    color: 12370112,
                    author: {
                      name: message.author.username,
                      icon_url: message.author.avatarURL,                  
                    }, 
                    description: userLastMessage.content,
                    timestamp: new Date()
                }
            });
            message.delete(500);
        }
        else {
            message.reply("private does not take 2 arguments.");
        }
    }    
});

client.login(config.token);