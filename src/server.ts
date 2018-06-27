import { MainController } from "./controllers/main.controller";
import { StockController } from "./controllers/stock.controller";

const mach = require("mach");
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

    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    controllers.forEach(c => new c(app, db));

    mach.serve(app);
});
