const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
  _id: { type: String },
  longitude: { type: Number },
  latitude : { type: Number },
  active: { type: Boolean },
  lastCharged : { type: String }
}, { timestamps: true });

const deviceModel = new mongoose.model("devices", deviceSchema);

module.exports = deviceModel;