const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongooseReplica = require("mongoose");
const http = require("http");
const middleware = require('socketio-wildcard')();

const ParkingSpace = require("./models/parkingSpace");


/* Routers */
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const parkingRouter = require("./routes/parking");
const devicesRouter = require('./routes/devices');

dotenv.config();

const app = express();
const socket = express();
const port = process.env.PORT || 4444;
const server = http.createServer(socket);
// This creates our socket using the instance of the server
const io = socketIO(server);
io.use(middleware);

/* CORS setup */
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(process.env.MONGO_DATABASE_URL, {useNewUrlParser: true});
mongoose.Promise = global.Promise;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./auth/auth');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/parkings', parkingRouter);
app.use('/devices', devicesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

mongooseReplica.connect("mongodb://localhost/smartpark?replicaSet=rs", {useNewUrlParser: true});

const db = mongooseReplica.connection;

db.on('error', console.error.bind(console, 'Connection Error:'));

db.once('open', () => {
    io.on("connection", socket => {
        console.log("New client connected" + socket.id);
        //console.log(socket);
        // collection_devices.watch().on('change', change => console.log(change));
        // Returning all initial states of data
        socket.on("initial-data", () => {
            ParkingSpace.find({}).then(docs => {
                io.sockets.emit("new-data", docs);
            });
        });

        //@TODO: Refactor
        socket.on('*', (data) => {
            const obj = JSON.parse(data.data);
            if (obj.initial) {
                ParkingSpace.find({}).find({
                    "location": {
                        $near: {
                            $maxDistance: 5000,
                            $geometry: {type: 'Point', coordinates: [parseFloat(obj.lat), parseFloat(obj.lng)]}
                        }
                    }
                })
                    .select('available location.coordinates _id')
                    .then(spaces => {
                        io.sockets.emit("initial", JSON.stringify(spaces));
                    });
            } else {
                ParkingSpace.find({"available": true}).find({
                    "location": {
                        $near: {
                            $maxDistance: 5000,
                            $geometry: {type: 'Point', coordinates: [parseFloat(obj.data.location.coordinates[0]),
                                    parseFloat(obj.data.location.coordinates[1])]}
                        }
                    }
                })
                    .select('available location.coordinates _id')
                    .then(spaces => {
                        io.sockets.emit("reroute", JSON.stringify(spaces[0]));
                    });
            }
        });

        // disconnect is fired when a client leaves the server
        socket.on("disconnect", () => {

        });
    });
    console.log("Started");
    app.listen(8080, () => {
        console.log('Node server running on port 8080');
    });

    const taskCollection = db.collection('parkingspaces');
    const changeStream = taskCollection.watch();

    changeStream.on('change', (change) => {
        ParkingSpace.find({}).select('available location.coordinates _id').then(spaces => {
            io.sockets.emit("update", JSON.stringify(spaces));
        });
        //let obj = {'_id': change.documentKey._id, 'available': change.updateDescription.updatedFields.available};
        //io.sockets.emit('update', change.updateDescription.updatedFields)
    });

    server.listen(port, () => console.log(`Socket server started on port ${port}`));
});

module.exports = app;
