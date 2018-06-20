///<reference path="shared.d.ts" />

import { getProviders } from "./providers/provider";

let providers = getProviders("PL");

// interate through providers untill valid results returned
providers[0].getData("CDR")
    .then(s => console.log(s))
    .catch(e => console.log("PError: " + e));