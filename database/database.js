//const {MongoClient} = require("mongodb");
const mongoose = require('mongoose');
const {groupAccount} = require("./groupAccount");

const userModel = require("./user").user;
const userAccount = require("./user").account;
const groupAccountModel = require("./groupAccount").groupAccount;

const defaultCurrencySymbol = "¤";

class Database {
    //static url = 'mongodb://localhost:27017'
    //static dbName = 'IGBC';
    //static collectionName = 'users';
    //static users;
    //static client;

    //connect();


    static async connect() {

        mongoose.connect(
            'mongodb://localhost:27017/IGBC',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        ).catch(error => console.log(error));
    }


    static async addUser(userID) {
        try{
            const userToAdd = new userModel(
                {
                    "userID" : userID,
                    "accounts" : []
                });
            return userToAdd.save();
        } catch(error) {
            console.log(error);
            return false;
        }
    }

    static async getUsers() {
        //return this.users.find().toArray();
        return userModel.find();
    }

    /*
    static close() {
        this.client.close();
    }*/

    static async register(userID) {

        if(await userModel.findOne({"userID": userID}) === null) {
            console.log(`Adding user ${userID}`);
            await this.addUser(userID);
            return true;
        } else {
            return false;
        }
    }

    static async addAccount(userID, accountName, amount) {
        let result = await userModel.findOne({"userID": userID});
        let account = result.accounts.filter(account =>
            account.name === accountName);
        //console.log("Filtered by name: " + account);
        if(account.length > 0) {
            return false;
        } else {
            const accountToAdd = new userAccount(
                {
                    "name": accountName,
                    "funds": amount,
                    "currencySymbol": defaultCurrencySymbol
                });
            //const savedAccount = accountToAdd.save();
            console.log(accountToAdd);
            result.accounts.push(accountToAdd);
            return result.save();
        }
    }

    static async addGroupAccount(id, ownerID, userIDs, accountName, amount) {
        let account = await groupAccountModel.findOne({"id": id});
        if(account) {
            return false;
        } else {
            const owner = await userModel.findOne({"userID" : ownerID});

            const users = await Promise.all(userIDs.map(async (userID) => {
                return userModel.findOne({"userID" : userID});
            }));


            console.log(users);

            const accountToAdd = new groupAccount(
                {
                    "name": accountName,
                    "id": id,
                    "funds": amount,
                    "currencySymbol": defaultCurrencySymbol,
                    "owner": owner,
                    "users": users
                });
            //const savedAccount = accountToAdd.save();
            console.log(accountToAdd);
            let account = await accountToAdd.save();
            await this.updateUserGroupAccounts(users, account);
            return account;
        }
    }

    static async updateUserGroupAccounts(users, groupAccount) {
        for (let user of users) {
            user.groupAccounts.push(groupAccount);
            user.save();
        }
    }

    static async alterGroupFunds(userID, accountID, amount) {
        let uM = await userModel.findOne({"userID": userID});
        let account = await this.getGroupAccount(uM, accountID);
        if(account) {
            account.funds = account.funds + amount;
            uM.save();
            return account.funds;
        } else {
            return null;
        }
    }

    static async getGroupFunds(userID, accountID) {
        let uM = await userModel.findOne({"userID": userID});
        let account = await this.getGroupAccount(uM, accountID);
        if(account) {
            return account.funds;
        } else {
            return false;
        }
    }


    static async getGroupAccount(userModel, accountID) {
        let account = userModel.accounts.filter(account =>
            account.id === accountID);
        if(account.length < 1) {
            return false;
        } else {
            return account[0];
        }
    }


    static async alterFunds(userID, accountName, amount) {
        let uM = await userModel.findOne({"userID": userID});
        let account = await this.getAccount(uM, accountName);
        if(account) {
            account.funds = account.funds + amount;
            uM.save();
            return account.funds;
        } else {
            return null;
        }

    }

    static async getFunds(userID, accountName) {
        let uM = await userModel.findOne({"userID": userID});
        let account = await this.getAccount(uM, accountName);
        if(account) {
            return account.funds;
        } else {
            return false;
        }
    }

    static async getAccount(userModel, accountName) {
        let account = userModel.accounts.filter(account =>
            account.name === accountName);
        if(account.length < 1) {
            return false;
        } else {
            return account[0];
        }
    }

    static async getUser(userID) {
        return userModel.findOne({"userID": userID});
    }

    static async getGroupAccountByID(id) {
        return groupAccountModel.findOne({"id": id});
    }
}

exports.database = Database;
