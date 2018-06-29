

import * as Wallet from "../views/wallet";
import Master from "../views/master.page";

import { Wallet as WalletModel } from "../models/wallet";

export class WalletController {
    constructor(app: any, database: any) {
        app.get("/", conn => conn.redirect("/wallet"));
        app.get("/wallet", conn => this.getIndex(conn));
        app.post("/wallet/add", conn => this.createNewWallet(conn, conn.params.name));
    }

    private getIndex(conn: any) {
        return WalletModel.find({})
            .exec() // get promise
            .then(wallets => {
                conn.send(
                    Master({ title: "Wallet", body: Wallet.toString({ data: wallets }) })
                );
            })
            .catch(r => {
                // TODO: remove console.log
                console.log("Rejected", r);
                conn.send(
                    Master({ title: "Wallet", body: Wallet.toString({ data: [] }) })
                );
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
}

