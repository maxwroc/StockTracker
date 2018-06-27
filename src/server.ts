///<reference path="shared.d.ts" />

import { MainController } from "./controllers/main.controller";
import { StockController } from "./controllers/stock.controller";

const mach = require("mach");
const mongoose = require("mongoose");

const controllers = [MainController, StockController];

let app = mach.stack();
app.use(mach.logger);

//Set up default mongoose connection
let mongoDB = 'mongodb://192.168.2.103:27017/stocktracker';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
let database = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
database.on('error', console.error.bind(console, 'MongoDB connection error:'));

controllers.forEach(c => new c(app, database));

mach.serve(app);