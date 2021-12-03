const mongoose = require("mongoose");
const GroupAccount = require("./groupAccount");


const AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  funds: {
    type: Number,
    required: true
  },
  currencySymbol: {
    type: String,
    required: true,
    trim: true
  }
});

const UserSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    trim: true
  },
  accounts: [AccountSchema],
  groupAccounts: [{
    type: mongoose.Types.ObjectId,
    ref: 'GroupAccount'}]

}, {collection : 'users'});



const User = mongoose.model("User", UserSchema);
const Account = mongoose.model("Account", AccountSchema);

exports.user = User;
exports.account = Account;