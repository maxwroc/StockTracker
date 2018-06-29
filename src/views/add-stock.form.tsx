import * as React from 'react';
import { renderToString } from "react-dom/server";
import { addScriptFile } from "./master.page";

export const Element = () => {
    addScriptFile("jquery.min.js", "add-stock.js");
    return (
        <form method="post" action="/stock" id="add-stock">
            <input type="text" name="name" list="symbols" autoCorrect="off" autoComplete="off" /> <input type="submit" value="Add" />
            <div className="loader hidden"></div>
            <datalist id="symbols">
            </datalist>
            <div id="message"></div>
        </form>
    );
}

export const toString = () =>
    renderToString(<Element />);
