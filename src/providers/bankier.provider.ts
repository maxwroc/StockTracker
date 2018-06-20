///<reference path="../shared.d.ts" />

import { getJsonData } from "./shared.provider"

export class Bankier implements IProvider {
    market = "PL";

    async getData(symbol: string): Promise<IStockData> {
        return await getJsonData<IStockData>(`https://www.bankier.pl/new-charts/get-data?symbol=${symbol}&intraday=true&type=area`);
    }
}
