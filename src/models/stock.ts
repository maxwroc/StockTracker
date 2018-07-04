import { model, Document, Model, Schema } from "mongoose";

export interface IStock extends Document {
    name: string,
    symbol: string,
    companyName: string
}

// create a schema
let stockSchema = new Schema({
    name: String,
    symbol: { type: String, required: true, unique: true },
    companyName: String
});

export let Stock: Model<IStock> = model("Stock", stockSchema);

export default Stock;