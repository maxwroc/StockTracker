
import { IProvider, IStockData, ICurrencyConversionResult, ICurrencyInfo } from "../shared";
import { getJsonData, IStockInfo } from "./shared.provider";

const suggestionsPattern = /\<[^\>]*\>([^\<]+)\</g;

interface IBankierStockSymbol {
    query: string,
    suggestions: string[],
    html: string[],
    data: string[]
}

interface IBankierCurrencyConversionResult {
    kody: string[][],
    wynik: number
}

export class Bankier implements IProvider {
    market = "PL";

    async getData(symbol: string): Promise<IStockData> {
        return await getJsonData<IStockData>(
            `https://www.bankier.pl/new-charts/get-data?symbol=${symbol}&intraday=true&type=area`);
    }

    async getSymbols(query: string): Promise<IStockInfo[]> {
        return await getJsonData<IStockInfo[]>(
            `https://www.bankier.pl/sdata/search?query=${query}`,
            i => this.convertToStockInfo(i));
    }

    async getCurrencyCodes(): Promise<ICurrencyInfo[]> {
        return await getJsonData<ICurrencyInfo[]>(
            `https://www.bankier.pl/ajax/przelicz_waluty?kod_1=GBP&kod_2=PLN&kwota=1`,
            c => this.convertToCurrencyModel(c));
    }

    async getCurrencyConversion(from: string, to: string): Promise<ICurrencyConversionResult> {
        return await getJsonData<ICurrencyConversionResult>(
            `https://www.bankier.pl/ajax/przelicz_waluty?kod_1=${from}&kod_2=${to}&kwota=1`,
            c => this.convertToConversionResult(from, to, c));
    }

    private convertToStockInfo(input: string): IStockInfo[] {
        let response = this.convertToJSON<IBankierStockSymbol>(input);

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

    private convertToCurrencyModel(response: IBankierCurrencyConversionResult): ICurrencyInfo[] {
        return response.kody.map(c => {
            return <ICurrencyInfo>{
                code: c[0],
                country: c[1]
            }
        });
    }

    private convertToConversionResult(from:string, to: string, input: string): ICurrencyConversionResult {
        let response = this.convertToJSON<IBankierCurrencyConversionResult>(input);
        return {
            from: from,
            to: to,
            result: response.wynik
        }
    }

    private getHtmlNodeTextValues(html: string): string[] {
        let results = [];
        let match: any[];

        while (match = suggestionsPattern.exec(html)) {
            results.push(match[1]);
        }

        return results;
    }

    private convertToJSON<T>(input: string): T {
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


Response for: https://www.bankier.pl/ajax/przelicz_waluty?kod_1=GBP&kod_2=PLN&kwota=100
{
	"kody": [
		["CHF", "Szwajcaria"],
		["EUR", "EUGiW"],
		["PLN", "Polska"],
		["USD", "USA"],
		["AED", "Zjednoczone Emiraty Arabskie"],
		["ALL", "Albania"],
		["AMD", "Armenia"],
		["ANG", "Antyle Holenderskie"],
		["ARS", "Argentyna"],
		["AUD", "Australia"],
		["AWG", "Aruba"],
		["BBD", "Barbados"],
		["BDT", "Bangladesz"],
		["BGN", "Bu\u0142garia"],
		["BHD", "Bahrajn"],
		["BIF", "Burundi"],
		["BND", "Brunei"],
		["BOB", "Boliwia"],
		["BRL", "Brazylia"],
		["BSD", "Bahama"],
		["BWP", "Botswana"],
		["BZD", "Belize"],
		["CAD", "Kanada"],
		["CNY", "Chiny"],
		["COP", "Kolumbia"],
		["CRC", "Kostaryka"],
		["CUP", "Kuba"],
		["CZK", "Czechy"],
		["DJF", "D\u017cibuti"],
		["DKK", "Dania"],
		["DOP", "Dominikana"],
		["DZD", "Algieria"],
		["EGP", "Egipt"],
		["ETB", "Etiopia"],
		["FJD", "Fid\u017ci"],
		["GBP", "W. Brytania"],
		["GEL", "Gruzja"],
		["GIP", "Gibraltar"],
		["GMD", "Gambia"],
		["GNF", "Gwinea"],
		["GTQ", "Gwatemala"],
		["GYD", "Gujana"],
		["HKD", "Hongkong"],
		["HNL", "Honduras"],
		["HRK", "Chorwacja"],
		["HTG", "Haiti"],
		["HUF", "W\u0119gry"],
		["IDR", "Indonezja"],
		["IQD", "Irak"],
		["IRR", "Iran"],
		["ISK", "Islandia"],
		["JMD", "Jamajka"],
		["JOD", "Jordania"],
		["JPY", "Japonia"],
		["KES", "Kenia"],
		["KGS", "Kirgistan"],
		["KHR", "Kambod\u017ca"],
		["KMF", "Komory"],
		["KRW", "Korea Po\u0142udniowa"],
		["KWD", "Kuwejt"],
		["KZT", "Kazachstan"],
		["LAK", "Laos"],
		["LBP", "Liban"],
		["LKR", "Sri Lanka"],
		["LRD", "Liberia"],
		["LSL", "Lesotho"],
		["LYD", "Libia"],
		["MAD", "Maroko"],
		["MDL", "Mo\u0142dawia"],
		["MKD", "Macedonia"],
		["MMK", "Birma"],
		["MNT", "Mongolia"],
		["MOP", "Makau"],
		["MUR", "Mauritius"],
		["MVR", "Malediwy"],
		["MWK", "Malawi"],
		["MXN", "Meksyk"],
		["MYR", "Malezja"],
		["NAD", "Namibia"],
		["NGN", "Nigeria"],
		["NIO", "Nikaragua"],
		["NOK", "Norwegia"],
		["NPR", "Nepal"],
		["NZD", "Nowa Zelandia"],
		["OMR", "Oman"],
		["PAB", "Panama"],
		["PEN", "Peru"],
		["PGK", "Papua"],
		["PHP", "Filipiny"],
		["PKR", "Pakistan"],
		["PYG", "Paragwaj"],
		["QAR", "Katar"],
		["RON", "Rumunia"],
		["RUB", "Rosja"],
		["RWF", "Ruanda"],
		["SAR", "Arabia Saudyjska"],
		["SBD", "Wyspy Salomona"],
		["SCR", "Seszele"],
		["SEK", "Szwecja"],
		["SGD", "Singapur"],
		["SLL", "Sierra Leone"],
		["SOS", "Somalia"],
		["SVC", "Salwador"],
		["SYP", "Syria"],
		["SZL", "Suazi"],
		["THB", "Tajlandia"],
		["TND", "Tunezja"],
		["TOP", "Wyspy Tonga"],
		["TRY", "Turcja"],
		["TTD", "Trynidad"],
		["TWD", "Tajwan"],
		["TZS", "Tanzania"],
		["UAH", "Ukraina"],
		["UGX", "Uganda"],
		["UYU", "Urugwaj"],
		["UZS", "Uzbekistan"],
		["VND", "Wietnam"],
		["VUV", "Vanuatu"],
		["WST", "Samoa Zachodnie"],
		["XAF", "Czad"],
		["XCD", "Grenada"],
		["XDR", "SDR"],
		["XPF", "Nowa Kaledonia"],
		["YER", "Jemen"],
		["ZAR", "RPA"]
	],
	"wynik": 496.27
}

*/