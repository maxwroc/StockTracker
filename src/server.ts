///<reference path="shared.d.ts" />

import { MainController } from "./controllers/main.controller";
import { StockController } from "./controllers/stock.controller";

const mach = require("mach");
const mongoose = require("mongoose");

const controllers = [MainController, StockController];

let app = mach.stack();
app.use(mach.logger);

let database = null;

controllers.forEach(c => new c(app, database));

mach.serve(app);