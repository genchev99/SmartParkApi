const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
  active: { type: Boolean },
  lastCharged : { type: Date },
  parkingSpace: { type: Schema.Types.ObjectId, ref: 'parkingSpace', unique: true }
}, { timestamps: true });


const DeviceModel = new mongoose.model("devices", DeviceSchema);

module.exports = DeviceModel;
