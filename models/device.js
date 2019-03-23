const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
  longitude: { type: Number },
  latitude : { type: Number },
  active: { type: Boolean },
  lastCharged : { type: String }
}, { timestamps: true });

const DeviceModel = new mongoose.model("devices", DeviceSchema);

module.exports = DeviceModel;