import * as React from 'react';
import { renderToString } from "react-dom/server";

import { AddItemForm } from "./add-item.form";
import { DataTable } from "./shared/datatable";

export const Wallet = ({ data }) =>
    <div>
        <div>
            <AddItemForm formAction="/wallet/add" suggestionsDataUrl="" submitBtnText="Add new wallet" />
        </div>
        <DataTable data={data} columns={["name", "createdAt"]} />
    </div>;

export const toString = ({ data }) =>
    renderToString(<Wallet data={data} />);

export default Wallet;