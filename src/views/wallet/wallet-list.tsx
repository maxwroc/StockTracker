import * as React from 'react';

import { AddItemForm } from "../add-item.form";
import { DataTable } from "../shared/datatable";

import { IWalletModel } from "../../models/wallet";
import { IViewConstructor } from '../../shared';

export interface IWalletListProps {
    data: IWalletModel[]
}

const List = ({ data }) => {
    if (data && data.length) {
        return <DataTable data={data} columns={{ "name": "Name", "createdAt": "Created" }} isClickable={true} />
    }

    return <div>Wallets not found. Please add one.</div>
}

export const WalletList: IViewConstructor<IWalletListProps> = ({ data }) =>
    <div>
        <div>
            <AddItemForm formAction="/wallet/add" suggestionsDataUrl="" submitBtnText="Add new wallet" />
        </div>
        <List data={data} />
    </div>;

export default WalletList;