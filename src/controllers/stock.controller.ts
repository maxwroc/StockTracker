
import { IStockData } from "../shared"
import { getProviders } from "../providers/provider";


export class StockController {
    constructor(app: any) {
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
}

