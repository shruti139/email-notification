const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String
        },
        userName: {
            type: String
        }
    },
    { timestamps: true }
);
module.exports = new mongoose.model("user", userSchema);
