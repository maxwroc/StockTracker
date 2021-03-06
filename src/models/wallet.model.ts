import { model, Document, Model, Schema, Types } from "mongoose";
import { IStockModel } from "./stock.model";
import { ICurrencyModel } from "./currency.model";

export interface IWalletModel extends Document {
    name: string
    stocks: Types.DocumentArray<IStockModel>,
    currency: Types.DocumentArray<ICurrencyModel>,
    createdAt: Date
}

// create a schema
let walletSchema = new Schema({
    name: { type: String, required: true, unique: true },
    stocks: [{ type: Schema.Types.ObjectId, ref: "Stock" }],
    currency: [{ type: Schema.Types.ObjectId, ref: "Currency" }],
    createdAt: Date
});

// on every save, add the date
walletSchema.pre("save", next => {
    // get the current date
    let currentDate = new Date();

    // if created_at doesn't exist, add to that field
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }

    next();
});

export let WalletModel: Model<IWalletModel> = model("Wallet", walletSchema);

export default WalletModel;