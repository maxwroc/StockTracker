
import * as React from 'react';
import { AddItemForm } from "../add-item.form";
import { DataTable } from "../shared/datatable";
import { IViewConstructor } from "../../shared";

import { IWalletModel } from "../../models/wallet"

interface IWalletViewProps {
    wallet: IWalletModel
}

export const Wallet: IViewConstructor<IWalletViewProps> = ({ wallet }) =>
    <div>
        <h1>Wallet details</h1>
        <h3>Name: {wallet.name}</h3>
        <AddItemForm formAction={"/wallet/" + encodeURIComponent(wallet.name)} suggestionsDataUrl="/stock/search" submitBtnText="Add symbol to track" />
        <DataTable isClickable={false} data={wallet.stocks} columns={["name", "symbol", "companyName"]} />
    </div>;



