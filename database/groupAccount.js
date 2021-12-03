const mongoose = require("mongoose");
const User = require("./user");


const AccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    id: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length !== 8) throw new Error(`Invalid ID ${value}.`);
        }
    },
    funds: {
        type: Number,
        required: true
    },
    currencySymbol: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    users: [{
        type: mongoose.Types.ObjectId,
        ref: "User"}]

}, {collection : 'groupaccounts'});

const GroupAccount = mongoose.model("GroupAccount", AccountSchema);

exports.groupAccount = GroupAccount;