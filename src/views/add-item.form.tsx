import * as React from 'react';
import { addScriptFile } from "./master.page";

// make sure all the ids will be unique across the page
let counter = 0;

export const AddItemForm = ({ formAction, suggestionsDataUrl }) => {
    counter++;
    let dataListId = "suggestions_" + counter;

    // make sure required js code is available
    addScriptFile("jquery.min.js", "add-item.js");

    return (
        <form method="post" action={formAction} className="add-item">
            <input type="text" name="name" list={dataListId} autoCorrect="off" autoComplete="off" data-suggestions={suggestionsDataUrl} />
            <datalist id={dataListId}>
            </datalist>
            <input type="submit" value="Add" />
            <div className="loader hidden"></div>
            <datalist id="suggestions">
            </datalist>
            <div className="message"></div>
        </form>
    );
}