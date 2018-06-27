
import { getProviders } from "../providers/provider";


export class StockController {
    constructor(app: any, database: any) {
        app.get('/stock/:symbol', conn => this.getStock(conn, conn.params.symbol));
        app.post('/stock', conn => this.addStock(conn, JSON.stringify(conn.params)));
    }

    private getStock(conn: any, symbol: string): Promise<IStockData> {
        let providers = getProviders("PL");
        return providers[0].getData(symbol)
                  .then(s => conn.json(200, s))
    }

    private addStock(conn:any, name: string) {
        return "Name: " + name;
    }
}

