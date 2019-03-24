const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({
    name: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    parkingSpace: { type: Schema.Types.ObjectId, ref: 'parkingSpace' }
}, { timestamps: true });


const FavoriteModel = new mongoose.model("favorites", FavoriteSchema);

module.exports = FavoriteModel;
