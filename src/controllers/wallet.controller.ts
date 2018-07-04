
import { Master, jsxToString } from "../views/master.page";
import { WalletList, IWalletListProps } from "../views/wallet/wallet-list";
import { Wallet } from "../views/wallet/wallet";

import { getProviders } from "../providers/provider";
import { Wallet as WalletModel, IWalletModel } from "../models/wallet";
import { Stock as StockModel, IStock } from "../models/stock";
import { ModelFindOneAndUpdateOptions } from "mongoose";

export class WalletController {
    constructor(app: any, database: any) {
        app.get("/", conn => conn.redirect("/wallet"));
        app.get("/wallet", conn => this.getWalletList(conn));
        app.get("/wallet/:name", conn => this.getWallet(conn, conn.params.name));
        app.post("/wallet/:wallet_name", conn => this.addSymbolToTrack(conn, conn.params.wallet_name, conn.params.name));
        app.post("/wallet/search", conn => this.search(conn));
        app.post("/wallet/add", conn => this.createNewWallet(conn, conn.params.name));
    }

    private getWalletList(conn: any) {
        return WalletModel.find({})
            .exec() // get promise
            .then(wallets => {
                conn.send(
                    Master({
                        title: "Wallet list",
                        body: jsxToString(WalletList, { data: this.decorateWithUrl(wallets) })
                    })
                );
            })
            .catch(r => {
                // TODO: remove console.log
                console.log("Rejected", r);
                conn.send(
                    Master({ title: "Wallet list", body: jsxToString(WalletList, {}) })
                );
            });
    }

    private getWallet(conn, name) {
        return WalletModel.findOne({ name: name })
            .populate("stocks")
            .exec()
            .then(wallet => {
                conn.send(
                    Master({ title: "Wallet list", body: jsxToString(Wallet, { wallet: wallet }) })
                );
            })
            .catch(r => {
                console.log(r);
                conn.send(404, "Wallet not found");
            });
    }

    private search(conn: any) {
        return WalletModel.find({})
            .exec() // get promise
            .then(wallets => {
                conn.json(200, { success: "OK", result: wallets.map(w => w["name"]) })
            });
    }

    private createNewWallet(conn: any, name: string) {

        if (name == "") {
            return new Promise(r => setTimeout(() => r(), 2000)).then(() => conn.json(200, { error: "Name cannot be empty" }));
        }

        return new WalletModel({ name: name, createdAt: new Date() })
            .save()
            .then(w => conn.json(200, { success: "OK", redirect: "/" }))
            .catch(r => conn.json(200, { error: r }));
    }

    private addSymbolToTrack(conn, walletName: string, stockSymbol: string) {
        let wallet: IWalletModel;

        stockSymbol = stockSymbol.toLowerCase();

        return WalletModel.findOne({ name: walletName }).exec()
            .then(w => {
                // getting wallet model
                if (!w) {
                    throw new Error("Wallet with given name not found");
                }

                wallet = w;

                return getProviders("PL")[0].getSymbols(stockSymbol);
            })
            .then(symbols => {
                // checking if given symbol is valid
                let result = symbols.find(v => v.toLowerCase() == stockSymbol);
                if (!result) {
                    throw new Error("Unknown stock symbol");
                }

                return stockSymbol;
            })
            .then(stockSymbol => {
                // trying to get stock or create it if not found
                var query = { symbol: stockSymbol },
                    update = { name: "some name", symbol: stockSymbol, companyName: "Company name " + (new Date().toTimeString()) },
                    options = <ModelFindOneAndUpdateOptions>{ upsert: true, new: true, setDefaultsOnInsert: true, returnNewDocument: true };

                return StockModel
                    .findOneAndUpdate(query, update, options)
                    .exec();
            })
            .then(stock => {
                console.log(wallet.stocks ? "wallet.stocks already there" : "wallet.stocks not there");

                // add stock symbol to the wallet
                wallet.stocks = wallet.stocks || [];
                if (wallet.stocks.indexOf(stock._id) != -1) {
                    throw new Error("Stock symbol added to the wallet already");
                }

                wallet.stocks.push(stock._id);

                return wallet.save();
            })
            .then(wallet => {
                conn.json(200, { success: "OK", redirect: this.getWalletUrl(wallet) })
            })
            .catch(err => {
                if (err && err.name == "MongoError" && err.code == 11000 && err.message.indexOf("stocktracker.stocks.$symbol") != -1) {
                    err.message = "Stock 'symbol' added already";
                }

                conn.json(200, { error: err.message });
            });
    }

    private decorateWithUrl(wallets: any[]) {
        wallets.forEach(w => w.url = this.getWalletUrl(w));
        return wallets;
    }

    private getWalletUrl(wallet: IWalletModel) {
        return "/wallet/" + encodeURIComponent(wallet.name);
    }
}

