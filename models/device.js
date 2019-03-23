const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
  location: {
    type: {
      type: String,
      default: 'Point'
      /*enum: ['Point'],
      required: true*/
    },
    coordinates: [],
    /*
    coordinates: {
        type: [Number],
        required: true
    },
    */
    //index: '2dsphere'
  },
  active: { type: Boolean },
  lastCharged : { type: Date }
}, { timestamps: true });

DeviceSchema.index({index: '2dsphere'});
const DeviceModel = new mongoose.model("devices", DeviceSchema);

module.exports = DeviceModel;