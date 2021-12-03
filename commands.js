//const { Client, Intents } = require('discord.js');
const {database} = require("./database/database");

class Commands {

    static database;

    static async create(message, accountName, funds) {
        const result = await database.addAccount(message.author.id, accountName, funds);
        if(result) {
            message.channel.send("\`\`\`CSS\n" +
                "New Account!\n" +
                `${accountName}: ¤ ${funds}\`\`\``);
        } else {
            message.channel.send('Failed to add account.');
        }
    };

    static async register(message) {
        if(await database.register(message.author.id)) {
            message.channel.send(`User registered!`);
        } else {
            message.channel.send(`User already registered.`);
        }
    }

    static async deposit(message, accountName, funds) {
        if(funds > 0) {
            let result = await database.alterFunds(message.author.id, accountName, funds);
            if(result !== null) {
                message.channel.send("\`\`\`CSS\n" +
                    `${accountName}: ¤ ${result}\`\`\``);
            } else {
                message.channel.send(`Account \"${accountName}\" does not exist.`);
            }
        }else {
            message.channel.send(`Deposit amount must be greater than zero.`);
        }
    }

    static async withdraw(message, accountName, funds) {
        if(funds > 0) {
            let currentFunds = await database.getFunds(message.author.id, accountName);

            if(funds > currentFunds) {
                message.channel.send(`Withdraw amount too high. Current funds: ${currentFunds}`);
                return;
            }


            let result = await database.alterFunds(message.author.id, accountName, -1 * funds);
            if(result !== null) {
                message.channel.send("\`\`\`CSS\n" +
                    `${accountName}: ¤ ${result}\`\`\``);
            } else {
                message.channel.send(`Account \"${accountName}\" does not exist.`);
            }
        }else {
            message.channel.send(`Withdraw amount must be greater than zero.`);
        }
    }

    static async funds(message, accountName) {
        let result = await database.getFunds(message.author.id, accountName);
        if(result !== null) {
            message.channel.send(`${accountName} funds: ${result}`);
        } else {
            message.channel.send(`Account \"${accountName}\" does not exist.`);
        }
    }

    static async createGroupAccount(message, accountName, users, amount) {
        let accountID = this.generateID();
        let result = await database.addGroupAccount(accountID, message.author.id, users, accountName, amount);

        while (!result) {
            accountID = this.generateID();
            result = await database.addGroupAccount(accountID, message.author.id, users, accountName, amount);
        }

    }

    static generateID() {
        let result = "";
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (let i = 0; i < 8; i++ ) {
            result += characters.charAt(Math.floor(Math.random() *
                characters.length));
        }
        return result;
    }

    static async groupFunds(message, accountID) {
        let result = await database.getGroupFunds(message.author.id, accountID);
        if(result !== null) {
            let accountName = await database.getGroupAccountByID(accountID).name;
            message.channel.send(`${accountName} funds: ${result}`);
        } else {
            message.channel.send(`Account \"${accountID}\" does not exist.`);
        }
    }

    static groupDeposit(message, accountName) {

    }

    static groupWithdraw(message, accountName) {

    }


    static help(message) {
        message.channel.send(
            "\`\`\`CSS\n" +
            "Commands List: " +
            "\ncreateaccount" +
            "\ndeposit" +
            "\nwithdraw" +
            "\naccounts" +
            "\nfunds" +
            "\nhelp" +
            "\nregister" +
            "\`\`\`");
    }

    static async groupAccounts(message) {
        let accountString = "";
        let temp = "";

        let result = await (await database.getUser(message.author.id))
            .populate("groupAccounts")
            .exec((err, user) => {
                if (err) console.log(err);
                console.log(user);
                for (const account of user.groupAccounts) {
                    temp = account.name + ": "
                        + account.currencySymbol + " "
                        + account.funds;

                    accountString = accountString + temp + "\n";
                    console.log(`Account string: ${accountString}`);
                }
            });
        //todo fix this mess
        message.channel.send("\`\`\`CSS\n" + accountString + "\`\`\`");

    }

    static async accounts(message) {
        let result = await database.getUser(message.author.id);

        let accountString = "";
        let temp = "";

        for (const account of result.accounts) {
            temp = account.name + ": "
                + account.currencySymbol + " "
                + account.funds;

            accountString = accountString + temp + "\n";
        }

        message.channel.send("\`\`\`CSS\n" + accountString + "\`\`\`");

    }


}

exports.commands = Commands;