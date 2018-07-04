import * as React from 'react';

import { AddItemForm } from "../add-item.form";
import { DataTable } from "../shared/datatable";

import { IWalletModel } from "../../models/wallet"

export interface IWalletListProps {
    data: IWalletModel[]
}

export const WalletList: IViewConstructor<IWalletListProps> = ({ data }) =>
    <div>
        <div>
            <AddItemForm formAction="/wallet/add" suggestionsDataUrl="" submitBtnText="Add new wallet" />
        </div>
        <DataTable data={data} columns={["name", "createdAt"]} isClickable={true} />
    </div>;

export default WalletList;