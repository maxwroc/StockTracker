///<reference path="../shared.d.ts" />

import { getJsonData } from "./shared.provider"

interface IBankierStockSymbol {
    query: string,
    suggestions: string[],
    html: string[],
    data: string[]
}

export class Bankier implements IProvider {
    market = "PL";

    async getData(symbol: string): Promise<IStockData> {
        return await getJsonData<IStockData>(`https://www.bankier.pl/new-charts/get-data?symbol=${symbol}&intraday=true&type=area`);
    }

    async getSymbols(query: string): Promise<string[]> {
        return await getJsonData<string[]>(`https://www.bankier.pl/sdata/search?query=${query}`, i => this.convertSymbolList(i));
    }

    private convertSymbolList(input: string): string[] {
        let data = this.convertToJSON(input).data || [];
        const searchStr = "symbol=";
        return data
            .filter(s => s.indexOf(searchStr) != -1)
            .map(s => s.substring(s.indexOf(searchStr) + searchStr.length));
    }

    private convertToJSON(input: string): IBankierStockSymbol {
        let str = input.replace(/\n/g, "").replace(/"/g, '\\"').replace(/'/g, '"').replace(/(query|suggestions|html|data):/g, '"$1":').replace(/}.*/, "}");
        //console.log(str);
        return JSON.parse(str);
    }
}
