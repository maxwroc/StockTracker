import * as React from 'react';
import { addScriptFile } from "../master.page";
import { IViewConstructor, IMap } from '../../shared';

// make sure all the ids will be unique across the page
let counter = 0;

interface IAddItemFormProps {
    formAction: string,
    suggestionsDataUrl: string,
    submitBtnText: string,
    hiddenFields?: { name: string, value: string }[]
}

export const AddItemForm: IViewConstructor<IAddItemFormProps> = ({ formAction, suggestionsDataUrl, submitBtnText, hiddenFields }) => {
    counter++;
    let dataListId = "suggestions_" + counter;

    // make sure required js code is available
    addScriptFile("libs/jquery.min.js", "add-item.js");

    return (
        <form method="post" action={formAction} className="add-item form-group form-inline">
            <input className="form-control form-control-sm" type="text" name="name" list={dataListId} autoCorrect="off" autoComplete="off" data-suggestions={suggestionsDataUrl} />
            <datalist id={dataListId}>
            </datalist>
            <input type="submit" value={submitBtnText} className="btn btn-sm btn-dark " />
            <div className="loader hidden"></div>
            <datalist id="suggestions">
            </datalist>
            <div className="message form-control form-control-sm form-control-plaintext mx-3"></div>
            {hiddenFields && hiddenFields.map(field =>
                <input key={counter++} type="hidden" name={field.name} value={field.value} />)}
        </form>
    );
}