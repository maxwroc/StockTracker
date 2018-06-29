import * as mongoose from "mongoose";

let Schema = mongoose.Schema;

// create a schema
let walletSchema = new Schema({
    name: String,
    stocks: Array,
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

export let Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;