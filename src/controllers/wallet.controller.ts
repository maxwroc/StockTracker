
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
        app.get("/wallet/:name", conn => this.getWallet(conn, decodeURIComponent(conn.params.name)));
        app.post("/wallet/:wallet_name", conn => this.addSymbolToTrack(conn, decodeURIComponent(conn.params.wallet_name), conn.params.name));
        app.post("/wallet/add", conn => this.createNewWallet(conn, conn.params.name));
        app.delete("/wallet/:wallet_name", conn => this.deleteWallet(conn, decodeURIComponent(conn.params.wallet_name)));
        app.delete("/wallet/:wallet_name/:symbol", conn => this.deleteStockFromWallet(conn, decodeURIComponent(conn.params.wallet_name), decodeURIComponent(conn.params.symbol)));
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
                this.decorateWithRemoveUrl(wallet.name, wallet.stocks);
                conn.send(
                    Master({ title: "Wallet list", body: jsxToString(Wallet, { wallet: wallet }) })
                );
            })
            .catch(r => {
                console.log(r);
                conn.send(404, "Wallet not found");
            });
    }

    private createNewWallet(conn: any, name: string) {

        if (name == "") {
            return conn.json(200, { error: "Name cannot be empty" });
        }

        return new WalletModel({ name: name, createdAt: new Date() })
            .save()
            .then(w => conn.json(200, { success: "OK", redirect: "/" }))
            .catch(r => conn.json(200, { error: r }));
    }

    private addSymbolToTrack(conn, walletName: string, stockSymbol: string) {
        let wallet: IWalletModel;

        stockSymbol = stockSymbol.toUpperCase();

        return WalletModel.findOne({ name: walletName }).exec()
            .then(w => {
                // getting wallet model
                if (!w) {
                    throw new Error("Wallet with given name not found");
                }

                wallet = w;

                return getProviders("PL")[0].getSymbols(stockSymbol);
            })
            .then(stocksInfo => {
                // checking if given symbol is valid
                let result = stocksInfo.find(s => s.symbol == stockSymbol);
                if (!result) {
                    throw new Error("Unknown stock symbol");
                }

                return result;
            })
            .then(stockInfo => {
                // trying to get stock or create it if not found
                var query = { symbol: stockInfo.symbol },
                    update = { name: stockInfo.ticker, symbol: stockSymbol, companyName: stockInfo.companyName },
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
                conn.json(200, { error: err.message });
            });
    }

    private decorateWithUrl(wallets: any[]) {
        wallets.forEach(w => w.url = this.getWalletUrl(w));
        return wallets;
    }

    private decorateWithRemoveUrl(walletName: string, stocks: any[]) {
        stocks.forEach(w => w.deleteUrl = this.getWalletUrl(w));
        return stocks;
    }

    private deleteWallet(conn: any, walletName: string) {
        return WalletModel.deleteOne({ name: walletName })
            .exec()
            .then(r => conn.json(200, { success: "OK", redirect: "/wallet" }))
            .catch(e => conn.json(200, { error: e.message }));
    }

    private deleteStockFromWallet(conn: any, walletName: string, stockSymbol: string) {
        return Promise.all(
            [
                WalletModel.findOne({ name: walletName }).exec(),
                StockModel.findOne({ symbol: stockSymbol }).exec()
            ])
            .then(([wallet, stock]) => {
                let stocks = wallet.stocks.filter(s_id => s_id != stock._id);

                if (stocks.length == wallet.stocks.length) {
                    throw new Error(`Couldn't remove '${stock.symbol}' from wallet`);
                }

                wallet.stocks = stocks;

                return wallet.save();
            })
            .then(wallet => conn.json(200, { success: "OK", redirect: this.getWalletUrl(wallet) }))
            .catch(e => conn.json(200, { error: e.message }));
    }

    private getWalletUrl(wallet: IWalletModel) {
        return "/wallet/" + encodeURIComponent(wallet.name);
    }
}

