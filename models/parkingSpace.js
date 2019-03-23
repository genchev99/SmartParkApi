const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ParkingSpaceSchema = new Schema({
    available: { type: Boolean },
    device : { type: Schema.Types.ObjectId, ref: 'devices', unique: true },
    /*location: {
        type: {
            type: String,
            /!*enum: ['Point'],
            required: true*!/
        },
        coordinates: []
        /!*
        coordinates: {
            type: [Number],
            required: true
        },
        *!/
        //index: '2dsphere'  //tva moje i da trqbva???
    }*/
}, { timestamps: true });
ParkingSpaceSchema.index({"device.location" : '2dsphere'});


const ParkingSpaceModel = new mongoose.model("parkingSpace", ParkingSpaceSchema);

module.exports = ParkingSpaceModel;
