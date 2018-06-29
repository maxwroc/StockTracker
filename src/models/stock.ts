import * as mongoose from "mongoose";

let Schema = mongoose.Schema;

// create a schema
let stockSchema = new Schema({
  name: String,
  symbol: { type: String, required: true, unique: true },
  companyName: String
});

let Stock = mongoose.model("Stock", stockSchema);

export default Stock;