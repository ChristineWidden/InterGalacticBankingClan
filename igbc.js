// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
//const {account} = require("./database/user");
const Database = require("./database/database").database;
const Commands = require("./commands").commands;


// Create a new client instance
const client = new Client({ intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
    connectDatabase();
    console.log('Ready!');

});

// Login to Discord with your client's token
client.login(token);

client.on('messageCreate', (message) => {

    if(message.content.startsWith('$') && message.author !== client.user) {

        runCommands(message);
    }
});


function runCommands(message) {


    if(message.content.replace(" ", "").length < 2) {
        Commands.help(message);
    }

    let splitMessage = message.content.toLowerCase().substr(1).split(" ")
        .filter(item => item.length > 0);

    console.log(splitMessage);

    let funds;
    let accountName;

    switch(splitMessage[0]) {
        case "create":
        case "c":
        case "ca":
        case "createaccount":

            accountName = null;
            funds = Number.parseFloat(splitMessage[2]);
            if(splitMessage[1] && (!splitMessage[2] || !isNaN(funds))) {
                if(!splitMessage[2]) funds = 0;
                accountName = splitMessage[1];
                Commands.create(message, accountName, funds);
                break;
            }

            message.channel.send(`Syntax: $create [account name] [funds]`);

            break;
        case "deposit":
        case "d":
        case "dep":
            if(splitMessage[1] && splitMessage[2]) {
                funds = Number.parseFloat(splitMessage[2]);
                if(!isNaN(funds)) {
                    Commands.deposit(message, splitMessage[1], funds);
                    break;
                }
            }

            message.channel.send(`Syntax: $deposit [account name] [funds]`);

            break;
        case "withdraw":
        case "w":
            if(splitMessage[1] && splitMessage[2]) {
                funds = Number.parseFloat(splitMessage[2]);
                if(!isNaN(funds)) {
                    Commands.withdraw(message, splitMessage[1], funds);
                    break;
                }
            }

            message.channel.send(`Syntax: $withdraw [account name] [funds]`);

            break;
        case "a":
        case "accounts":
            Commands.accounts(message);
            break;
        case "ga":
        case "gas":
        case "groupaccounts":
            Commands.groupAccounts(message);
            break;
        case "funds":
        case "f":
            if (splitMessage[1]) {
                Commands.funds(message, splitMessage[1]);
            } else{
                message.channel.send(`Syntax: $funds [account name]`);
            }

            break;
        case "creategroupaccount":
        case "cga":
            console.log(message.content);

            accountName = null;
            funds = Number.parseFloat(splitMessage[2]);
            if(splitMessage[1] && (!splitMessage[2] || !isNaN(funds))) {
                if(!splitMessage[2]) funds = 0;
                accountName = splitMessage[1];

                let x = splitMessage.slice(3).map((userPing) => {
                    userPing = userPing.replace("<@!", "");
                    userPing = userPing.replace(">", "");
                    return userPing;
                });

                console.log(`Users: ${x}`);

                Commands.createGroupAccount(message, accountName, x, funds);
                break;
            }

            message.channel.send(`Syntax: $creategroupaccount [account name] [funds] [additional users]`);

            break;
        case "groupfunds":
        case "gf":
            if (splitMessage[1]) {
                Commands.funds(message, splitMessage[1]);
            } else{
                message.channel.send(`Syntax: groupfunds [account id]`);
            }

            break;
        case "groupdeposit":
        case "gd":
            break;
        case "groupwithdraw":
        case "gw":
            break;
        case "transfer":
        case "t":
            break;
        case "help":
        case "h":
            Commands.help(message);
            break;
        case "r":
        case "register":
            Commands.register(message);
            break;
    }
}

async function connectDatabase() {
    await Database.connect();

    let users = await Database.getUsers();
    Commands.database = Database;
    console.log(users);
}



