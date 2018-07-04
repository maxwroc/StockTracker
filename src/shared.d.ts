
interface IStockData extends IBankierStockData {

}

interface IProvider {
    market: string;
    getData(symbol: string): Promise<IStockData>;
    getSymbols(query: string): Promise<string[]>;
}

interface IBankierStockData {
    date_to: number,
    date_from: number,
    navigator: number[],
    volume: number[][],
    interval: number,
    main: number[][],
    intraday: boolean,
    profileData: {
        prevCloseDate: string, // '18-06-12 17:02',
        volumeAverageValue: string, // '2&nbsp;465&nbspszt',
        max: number, // 172.4,
        valueAverage: string, // '163,95',
        prevClose: string, // '150,20',
        prevCloseDB: (string | number)[], // [ 1528822963000, '150.20' ],
        changeValue: string, // '16,70',
        maxValueDate: string, // '18-06-18 12:10',
        minValueDate: string, // '18-06-13 14:14',
        min: number, // 151.5,
        maxValue: string, // '172,40',
        volumeSumValue: string, // '3&nbsp;098&nbsp;174&nbspszt',
        interval: number, // 7.14020833333333,
        turnoverSumValue: string, // '63&nbsp;477,743&nbspmln',
        valueSum: number, // 206088.6,
        turnoverAverageValue: string, // '50,499&nbspmln',
        minValue: string, // '151,50',
        endDate: string, // '2018-06-20 12:22',
        changePercentValue: string, // '11,12%',
        startDate: string, //'2018-06-13 09:00'
    }
}

interface IViewConstructor<T> {
    (props: T): JSX.Element;
}