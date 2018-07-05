import { model, Document, Model, Schema } from "mongoose";

export interface ICurrencyModel extends Document {
    code: string,
    country: string
}

// create a schema
let currencySchema = new Schema({
    code: { type: String, required: true, unique: true },
    country: String
});

export let CurrencyModel: Model<ICurrencyModel> = model("Currency", currencySchema);

export default CurrencyModel;