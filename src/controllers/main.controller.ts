

const mongoose = require("mongoose");

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
        conn.file("src/views/index.html");
    }
}
