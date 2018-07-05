
import { Master, jsxToString } from "../views/master.page";
import { WalletList } from "../views/wallet/wallet-list";
import { Wallet } from "../views/wallet/wallet";

import { WalletModel } from "../models/wallet.model";

export class WalletController {
    constructor(app: any) {
        app.get("/", conn => conn.redirect("/wallet"));
        app.get("/wallet", conn => this.getWalletList(conn));
        app.get("/wallet/:name", conn => this.getWallet(conn, decodeURIComponent(conn.params.name)));
        app.put("/wallet", conn => this.createNewWallet(conn, conn.params.name));
        app.delete("/wallet/:wallet_name", conn => this.deleteWallet(conn, decodeURIComponent(conn.params.wallet_name)));
    }

    private getWalletList(conn: any) {
        return WalletModel.find({})
            .exec() // get promise
            .then(wallets => {
                conn.send(
                    Master({
                        title: "Wallet list",
                        body: jsxToString(WalletList, { data: decorateWithUrl(wallets) })
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
        return WalletModel.findOne({ name: name })
            .populate("stocks")
            .exec()
            .then(wallet => {
                decorateWithRemoveUrl(wallet);
                conn.send(
                    Master({ title: "Wallet list", body: jsxToString(Wallet, { wallet: wallet }) })
                );
            })
            .catch(r => {
                console.log(r);
                conn.send(404, "Wallet not found");
            });
    }

    private createNewWallet(conn: any, name: string) {

        if (name == "") {
            return conn.json(200, { error: "Name cannot be empty" });
        }

        return new WalletModel({ name: name, createdAt: new Date() })
            .save()
            .then(w => conn.json(200, { success: "OK", redirect: "/" }))
            .catch(r => conn.json(200, { error: r }));
    }

    private deleteWallet(conn: any, walletName: string) {
        return WalletModel.deleteOne({ name: walletName })
            .exec()
            .then(r => conn.json(200, { success: "OK", redirect: "/wallet" }))
            .catch(e => conn.json(200, { error: e.message }));
    }
}


/* Helper functions */

function decorateWithUrl(wallets: any[]) {
    // adding "url" property
    wallets.forEach(w => w.url = getCompleteUrl("wallet", w.name));
    return wallets;
}

function decorateWithRemoveUrl(wallet) {
    wallet.stocks.forEach(s => s.deleteUrl = getCompleteUrl("watchlist", wallet.name, s.symbol));
    return wallet;
}

function getCompleteUrl(controller: string, ...chunks: any[]): string {
    chunks = chunks || [];
    chunks.unshift("", controller);
    return chunks.map(c => encodeURIComponent(c)).join("/");
}

