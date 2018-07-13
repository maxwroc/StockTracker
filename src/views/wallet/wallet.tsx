import * as React from 'react';
import { IWalletModel } from '../../models/wallet.model';
import { IViewConstructor } from '../../shared';
import { addScriptFile } from '../master.page';
import { DynamicTable } from '../shared/dynamictable.isom';


interface IWalletViewProps {
    wallet: IWalletModel
}

export const Wallet: IViewConstructor<IWalletViewProps> = ({ wallet }) => {
    addScriptFile("/react.development.js", "/react-dom.development.js", "libs/jquery.min.js", "dynamictable.isom.js");
    return (
        <div>
            <h1>Wallet {wallet.name}</h1>
            <section>
                <header>Finance sumarry</header>
                <div id="hello">
                    <DynamicTable />
                </div>
            </section>
            <section>
                <header>Stock quotes</header>
            </section>
            <section>
                <header>Currency converstion rates</header>
            </section>
        </div>
    );
}