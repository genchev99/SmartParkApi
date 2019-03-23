const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: { type: String },
    email: { type: String, required: true, unique: true },
    password : { type: String, required: true },
    locations: { type: Array }
}, { timestamps: true });

const userModel = new mongoose.model("users", userSchema);

module.exports = userModel;