import { model, Document, Model, Schema } from "mongoose";


export interface IWalletModel extends Document {
    name: string
    stocks: any[],
    createdAt: Date
}

// create a schema
let walletSchema = new Schema({
    name: { type: String, required: true, unique: true },
    stocks: [{ type: Schema.Types.ObjectId, ref: "Stock" }],
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

export let Wallet: Model<IWalletModel> = model("Wallet", walletSchema);


export default Wallet;