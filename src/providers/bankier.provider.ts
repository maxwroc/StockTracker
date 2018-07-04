///<reference path="../shared.d.ts" />

import { IProvider, IStockData } from "../shared"
import { getJsonData, IStockInfo } from "./shared.provider"

const suggestionsPattern = /\<[^\>]*\>([^\<]+)\</g;

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

    async getSymbols(query: string): Promise<IStockInfo[]> {
        return await getJsonData<IStockInfo[]>(`https://www.bankier.pl/sdata/search?query=${query}`, i => this.convertToStockInfo(i));
    }

    private convertToStockInfo(input: string): IStockInfo[] {
        let response = this.convertToJSON(input);

        return response.html
            .filter(h => h.indexOf('class="symbol"') != -1)
            .map(h => {
                let textValues = this.getHtmlNodeTextValues(h);

                if (textValues.length != 3) {
                    console.log(response);
                    throw new Error("Failed to parse Bankier response");
                }

                return <IStockInfo>{
                    ticker: textValues[0],
                    symbol: textValues[1],
                    companyName: textValues[2]
                }
            });
    }

    private getHtmlNodeTextValues(html: string): string[] {
        let results = [];
        let match: any[];

        while (match = suggestionsPattern.exec(html)) {
            results.push(match[1]);
        }

        return results;
    }

    private convertToJSON(input: string): IBankierStockSymbol {
        let str = input.replace(/\n/g, "").replace(/"/g, '\\"').replace(/'/g, '"').replace(/(query|suggestions|html|data):/g, '"$1":').replace(/}.*/, "}");
        //console.log(str);
        return JSON.parse(str);
    }
}



/*

Response for /sdata/search?query=fa
{
	query: 'FE',
	suggestions: ['SPÓŁKI',
		'FERRUM',
		'FORTUNA',
		'FERRO',
		'FEERUM',
		'Danemakroekonomiczne',
		'USA-StopafunduszyfederalnychFED',
		'USA-StopadyskontowaFED'],
	html: ['<span class="header">SpółkiGPW</span>',
		'<span class="ticker first">FER</span><span class="symbol">FERRUM</span><span class="kurs up">FerrumSA</span>',
		'<span class="ticker first">FEG</span><span class="symbol">FORTUNA</span><span class="kurs up">Fortunasázkovákancelář,a.s.</span>',
		'<span class="ticker first">FRO</span><span class="symbol">FERRO</span><span class="kurs up">FERROSA</span>',
		'<span class="ticker first">FEE</span><span class="symbol">FEERUM</span><span class="kurs up">FeerumS.A.</span>',
		'<span class="header">Danemakroekonomiczne</span>',
		'<span class="makro first">USA-StopafunduszyfederalnychFED</span><span class="kurs down">1.625%</span>',
		'<span class="makro first">USA-StopadyskontowaFED</span><span class="kurs down">2.0%</span>'],
	data: ['/gielda/notowania/akcje',
		'/inwestowanie/profile/quote.html?symbol=FERRUM',
		'/inwestowanie/profile/quote.html?symbol=FORTUNA',
		'/inwestowanie/profile/quote.html?symbol=FERRO',
		'/inwestowanie/profile/quote.html?symbol=FEERUM',
		'/gospodarka/wskazniki-makroekonomiczne',
		'/gospodarka/wskazniki-makroekonomiczne/stopa-funduszy-federalnych-fed-usa',
		'/gospodarka/wskazniki-makroekonomiczne/stopa-dyskontowa-fed-usa']
}

*/