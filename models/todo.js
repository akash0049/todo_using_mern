const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    validDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
});

const Todo = mongoose.model("Todos", todoSchema);

module.exports = Todo;