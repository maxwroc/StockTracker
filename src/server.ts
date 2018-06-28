import * as path from "path";
import { MainController } from "./controllers/main.controller";
import { StockController } from "./controllers/stock.controller";

import * as mach from "mach";
const mongoose = require("mongoose");

const controllers = [MainController, StockController];

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://192.168.2.103:27017/stocktracker', {
    useMongoClient: true,
}).then(db => {
    let app = mach.stack();
    // logging in console all incomming requests
    app.use(mach.logger);
    // parsing GET and POST params
    app.use(mach.params);
    // exposing public dir
    app.use(mach.file, path.join(__dirname, "public"));

    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    // initialize all controllers
    controllers.forEach(c => new c(app, db));

    mach.serve(app);
});

