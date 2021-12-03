const mongoose = require("mongoose");


const InfoSchema = new mongoose.Schema({
    groupAccountNames: {
        type: [String],
        required: true
    }
});