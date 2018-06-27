import * as React from 'react';
import { renderToString } from "react-dom/server";

export const Element = () =>
    <form method="post" action="">
        <input type="text" name="name" /> <input type="submit" value="Add" />
    </form>;

export const toString = () =>
    renderToString(<Element />);



