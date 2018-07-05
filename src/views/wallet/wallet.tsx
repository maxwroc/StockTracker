
import * as React from 'react';
import { AddItemForm } from "../add-item.form";
import { DataTable } from "../shared/datatable";
import { IViewConstructor } from "../../shared";

import { IWalletModel } from "../../models/wallet.model"

interface IWalletViewProps {
    wallet: IWalletModel
}

const WatchList = ({ data }) => {
    if (data && data.length) {
        return <DataTable isClickable={false} data={data} columns={{ name: "Ticker", symbol: "Symbol", companyName: "Company name" }} />
    }

    return <div>Watchlist empty. Please add stocks to track.</div>
}

export const Wallet: IViewConstructor<IWalletViewProps> = ({ wallet }) =>
    <div>
        <h1>Wallet details</h1>
        <h3>Name: {wallet.name}</h3>
        <AddItemForm formAction={"/watchlist/" + encodeURIComponent(wallet.name)} suggestionsDataUrl="/stock/search" submitBtnText="Add stock to watchlist" />
        <WatchList data={wallet.stocks} />
    </div>;



