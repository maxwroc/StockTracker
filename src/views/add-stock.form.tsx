import * as React from 'react';
import { renderToString } from "react-dom/server";
import { addScriptFile } from "./master.page";

export const Element = () => {
    addScriptFile("jquery.min.js", "add-stock.js");
    return (
        <form method="post" action="/stock" id="add-stock">
            <input type="text" name="name" list="symbols" /> <input type="submit" value="Add" />
            <datalist id="symbols">
            </datalist>
        </form>
    );
}

export const toString = () =>
    renderToString(<Element />);
