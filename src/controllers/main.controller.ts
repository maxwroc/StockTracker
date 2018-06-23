

const mongoose = require("mongoose");

import master from "../views/master.page";

let Schema = mongoose.Schema;

var StockType = new Schema({
    name: String,
    symbol: String
});

// Compile model from schema
var StockTypeModel = mongoose.model('StockType', StockType);


export class MainController {
    constructor(app: any, private database: any) {
        app.get("/", conn => this.getIndex(conn));
    }

    private getIndex(conn: any): void {
        conn.send(
            master({ title: "hello title", body: "hello body" })
        );
    }
}
