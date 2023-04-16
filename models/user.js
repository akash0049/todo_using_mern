const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    imageUrl: {
        type: String,
        default: ""
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("Users", userSchema);

module.exports = User;