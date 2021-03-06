
import * as React from 'react';
import { AddItemForm } from "../shared/add-item.form";
import { DataTable } from "../shared/datatable";
import { IViewConstructor } from "../../shared";

import { IWalletModel } from "../../models/wallet.model"

interface IWalletEditViewProps {
    wallet: IWalletModel
}

const WatchList = ({ data, columns }) => {
    if (data && data.length) {
        return <DataTable isClickable={false} data={data} columns={columns} />
    }

    return <div>Watchlist empty. Please add items to track.</div>
}

export const WalletEdit: IViewConstructor<IWalletEditViewProps> = ({ wallet }) =>
    <div>
        <h1>Wallet {wallet.name} - edit</h1>
        <section>
            <header>Stocks watchlist</header>
            <AddItemForm
                formAction={"/watchlist/" + encodeURIComponent(wallet.name)}
                suggestionsDataUrl="/stock/search"
                submitBtnText="Add stock to watchlist" />
            <WatchList data={wallet.stocks} columns={{ name: "Ticker", symbol: "Symbol", companyName: "Company name" }} />
        </section>
        <section>
            <header>Currency watchlist</header>
            <AddItemForm
                formAction="/watchlist/currency"
                suggestionsDataUrl="/currency/search"
                submitBtnText="Add currency to watchlist"
                hiddenFields={[{ name: "wallet", value: wallet.name }]} />
            <WatchList data={wallet.currency} columns={{ code: "Code", country: "Country" }} />
        </section>
    </div>;



