
import { IStockData } from "../shared"
import { getProviders } from "../providers/provider";
import { CurrencyModel } from "../models/currency.model";


export class StockController {
    constructor(app: any) {
        app.post('/currency/search', conn => this.searchCurrency(conn, conn.params.name));
        app.post('/stock/search', conn => this.searchSymbol(conn, conn.params.name));
        app.get('/stock/:symbol', conn => this.getStock(conn, conn.params.symbol));
        app.post('/stock/add', conn => this.addStock(conn, conn.params.name));
    }

    private getStock(conn: any, symbol: string): Promise<IStockData> {
        let providers = getProviders("PL");
        return providers[0].getData(symbol)
            .then(s => conn.json(200, s));
    }

    private addStock(conn:any, name: string) {
        return conn.json(200, { error: "zonk" })
    }

    private searchSymbol(conn: any, query: string) {

        if (query == "") {
            return conn.json(200, { error: "Query cannot be empty" });
        }

        let providers = getProviders("PL");
        return providers[0].getSymbols(query)
            .then(s => conn.json(200, { success: "OK", result: s.map(i => i.symbol) }));
    }

    private searchCurrency(conn, name: string) {
        name = name.toUpperCase();
        return CurrencyModel.find({}).exec()
            .then(currency => {
                if (currency && currency.length) {
                    return conn.json(200, { success: "OK", source: "local", result: currency.filter(c => c.code.startsWith(name)).map(c => c.code) })
                }

                let providers = getProviders("PL");
                return providers[0].getCurrencyCodes()
                    .then(codes => {
                        if (!codes || codes.length == 0) {
                            throw new Error("Failes to received currency codes");
                        }

                        return CurrencyModel.insertMany(codes)
                    })
                    .then(r => {
                        if (r.length == 0) {
                            throw new Error("Failes to save currency codes")
                        }

                        conn.json(200, { success: "OK", source: "remote", result: r.map(c => c.code) });
                    })
                    .catch(e => conn.json(200, { error: e.message }))
            });
    }
}

