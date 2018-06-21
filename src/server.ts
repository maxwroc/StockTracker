///<reference path="shared.d.ts" />

import { getProviders } from "./providers/provider";
let mach = require("mach");

let providers = getProviders("PL");

var app = mach.stack();
app.use(mach.logger);
app.get('/stock/:id', conn => {
  var id = conn.params.id;

  return providers[0].getData(id)
        .then(s => conn.json(200, s))
});

mach.serve(app);