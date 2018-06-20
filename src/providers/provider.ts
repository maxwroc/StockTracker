///<reference path="../shared.d.ts" />

import { Bankier } from "./bankier.provider";

let providers: IProvider[] = [new Bankier()];

export function getProviders(market: string): IProvider[] {
    return providers.filter(p => p.market == market);
}

