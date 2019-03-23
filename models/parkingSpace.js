const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ParkingSpaceSchema = new Schema({
    available: { type: Boolean },
    device : { type: Schema.Types.ObjectId, ref: 'devices', unique: true },
    location: {
        type: {
            type: String,
            default: 'Point'
            /*enum: ['Point'],
            required: true*/
        },
        coordinates: []
        /*
        coordinates: {
            type: [Number],
            required: true
        },
        */
    }
}, { timestamps: true });

ParkingSpaceSchema.index({"location" : '2dsphere'});


const ParkingSpaceModel = new mongoose.model("parkingSpace", ParkingSpaceSchema);

module.exports = ParkingSpaceModel;
