import { WalletList, IWalletListProps } from "../views/wallet/wallet-list";
import { Master, jsxToString } from "../views/master.page";

import { Wallet as WalletModel } from "../models/wallet";

export class WalletController {
    constructor(app: any, database: any) {
        app.get("/", conn => conn.redirect("/wallet"));
        app.get("/wallet", conn => this.getWalletList(conn));
        app.get("/wallet/:name", conn => this.getWallet(conn, conn.params.name));
        app.post("/wallet/search", conn => this.search(conn));
        app.post("/wallet/add", conn => this.createNewWallet(conn, conn.params.name));
    }

    private getWalletList(conn: any) {
        return WalletModel.find({})
            .exec() // get promise
            .then(wallets => {
                conn.send(
                    Master({
                        title: "Wallet list",
                        body: jsxToString(WalletList, { data: this.decorateWithUrl(wallets) })
                    })
                );
            })
            .catch(r => {
                // TODO: remove console.log
                console.log("Rejected", r);
                conn.send(
                    Master({ title: "Wallet list", body: jsxToString(WalletList, {}) })
                );
            });
    }

    private getWallet(conn, name) {
        return conn.send(
            Master<IWalletListProps>({ title: "Wallet list", body: jsxToString(WalletList, { data: [] }) })
        );
    }

    private search(conn: any) {
        return WalletModel.find({})
            .exec() // get promise
            .then(wallets => {
                conn.json(200, { success: "OK", result: wallets.map(w => w["name"]) })
            });
    }

    private createNewWallet(conn: any, name: string) {

        if (name == "") {
            return new Promise(r => setTimeout(() => r(), 2000)).then(() => conn.json(200, { error: "Name cannot be empty" }));
        }

        return new WalletModel({ name: name, createdAt: new Date() })
            .save()
            .then(w => conn.json(200, { success: "OK", redirect: "/" }))
            .catch(r => conn.json(200, { error: r }));
    }

    private decorateWithUrl(wallets: any[]) {
        wallets.forEach(w => w.url = "/wallet/" + encodeURIComponent(w.name));
        return wallets;
    }
}

