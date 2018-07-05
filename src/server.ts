
import * as mach from "mach";
import * as mongoose from "mongoose";

import * as path from "path";
import { controllers } from "./controllers";

// Get Mongoose to use the global promise library
mongoose[<string>"Promise"] = global.Promise; // string cast to make TS compiler happy

mongoose.connection.on("error", console.error.bind(console, 'MongoDB connection error:'));

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

    // initialize all controllers
    controllers.forEach(c => new c(app));

    mach.serve(app);
});

