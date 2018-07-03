
import * as React from 'react';
import { IWalletModel } from "../../models/wallet";

interface IWalletViewProps {
    wallet: IWalletModel
}

interface IView {
    (wallet: IWalletViewProps): JSX.Element;
}

export const Wallet: IView = ({ wallet }) =>
    <div>
        <h1>Wallet details</h1>
        <h3>Name: {wallet.name}</h3>
    </div>;



