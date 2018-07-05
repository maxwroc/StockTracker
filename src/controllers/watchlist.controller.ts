
import { ModelFindOneAndUpdateOptions } from "mongoose";
import { IMap } from "../shared"
import { WalletModel, IWalletModel } from "../models/wallet.model";
import StockModel from "../models/stock.model";
import { getProviders } from "../providers/provider";

export class WatchlistController {
    constructor(app: any) {
        app.put("/watchlist/:wallet", conn => this.addStock(conn, this.getSafeParams(conn, "wallet", "name")));
        app.delete("/watchlist/:walletName/:stockSymbol", conn => this.deleteStock(conn, this.getSafeParams(conn, "walletName", "stockSymbol")));

        app.put("/watchlist/currency", conn => this.callWithSafeParams(this.addCurrency, conn, "wallet", "name"));
    }

    private addStock(conn: any, { wallet, name }): Promise<IWalletModel> {
        let walletModel: IWalletModel;

        name = name.toUpperCase();

        return WalletModel.findOne({ name: wallet })
            .populate("stocks")
            .exec()
            .then(w => {
                // getting wallet model
                if (!w) {
                    throw new Error(`Wallet '${wallet}' not found`);
                }

                walletModel = w;

                return getProviders("PL")[0].getSymbols(name);
            })
            .then(stocksInfo => {
                // checking if given symbol is valid
                let result = stocksInfo.find(s => s.symbol == name);
                if (!result) {
                    throw new Error("Unknown stock symbol");
                }

                return result;
            })
            .then(stockInfo => {
                // trying to get stock or create it if not found
                var query = { symbol: stockInfo.symbol },
                    update = { name: stockInfo.ticker, symbol: name, companyName: stockInfo.companyName },
                    options = <ModelFindOneAndUpdateOptions>{ upsert: true, new: true, setDefaultsOnInsert: true, returnNewDocument: true };

                return StockModel
                    .findOneAndUpdate(query, update, options)
                    .exec();
            })
            .then(stock => {
                if (walletModel.stocks.find(s => s._id == stock._id)) {
                    throw new Error("Stock symbol added to the wallet already");
                }

                walletModel.stocks.push(stock);

                return walletModel.save();
            })
            .then(wallet => conn.json(200, { success: "OK", redirect: this.getWalletUrl(wallet) }))
            .catch(err => conn.json(200, { error: err.message }));
    }

    private deleteStock(conn: any, { walletName, stockSymbol }) {
        return StockModel.findOne({ symbol: stockSymbol }).exec()
            .then(stock => WalletModel.update({ name: walletName }, { $pullAll: { stocks: [stock._id] } }).exec())
            .then(r => {
                if (!r.ok) {
                    throw new Error("Failed to remove stock symbol from wallet");
                }

                conn.json(200, { success: "OK", redirect: this.getWalletUrl(walletName) });
            })
            .catch(e => conn.json(200, { error: e.message }));
    }

    private addCurrency(conn, walletName: string, currency: string) {

    }

    private getWalletUrl(wallet: IWalletModel | string) {
        return "/wallet/" + encodeURIComponent(typeof wallet == "string" ? wallet : wallet.name);
    }

    private getSafeParams(conn, ...names: string[]): any {
        let result: IMap<string> = {};
        names.forEach(n => result[n] = decodeURIComponent(conn.params[n]));
        return result;
    }

    private callWithSafeParams<T extends Function>(func: T, conn, ...names: string[]) {
        names = names.map(n => {
            if (typeof conn.params[n] == "undefined") {
                throw new Error("Missing parameter: " + n);
            }

            return decodeURIComponent(conn.params[n])
        });
        names.unshift(conn);
        return func.apply(this, names);
    }
}