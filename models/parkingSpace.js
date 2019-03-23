const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ParkingSpaceSchema = new Schema({
    available: { type: Boolean },
    device : { type: Schema.Types.ObjectId, ref: 'device' },
    location: {
        type: {
            type: String,
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
        //index: '2dsphere'  //tva moje i da trqbva???
    }
}, { timestamps: true });

const ParkingSpaceModel = new mongoose.model("parking_space", ParkingSpaceSchema);

module.exports = ParkingSpaceModel;