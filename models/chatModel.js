const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    messgage: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    room: {
        type: Number
    }
}, { timestamps: true });

const chatModel = new mongoose.model("chat", chatSchema);

module.exports = chatModel;

