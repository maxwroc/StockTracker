import * as React from 'react';
import { renderToString } from "react-dom/server";

import { AddItemForm } from "./add-item.form";
import { DataTable } from "./shared/datatable";

export const WalletList = ({ data }) =>
    <div>
        <div>
            <AddItemForm formAction="/wallet/add" suggestionsDataUrl="" submitBtnText="Add new wallet" />
        </div>
        <DataTable data={data} columns={["name", "createdAt"]} />
    </div>;

export const toString = ({ data }) =>
    renderToString(<WalletList data={data} />);

export default WalletList;