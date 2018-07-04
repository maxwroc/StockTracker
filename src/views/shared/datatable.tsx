
import * as React from 'react';
import { addScriptFile } from "../master.page";
import { IViewConstructor } from "../../shared";

let counter = 0;

export interface IDataTableProps {
    data: any[];
    columns: string[] | { [column: string]: string };
    isClickable?: boolean;
}

export const DataTable: IViewConstructor<IDataTableProps> = ({ data, columns, isClickable }) => {

    let classNames = ["datatable", "table", "table-sm"];
    if (isClickable) {
        addScriptFile("datatable.js");
        classNames.push("table-hover");
    }

    let hasDeleteButton = data.some(r => r.deleteUrl);

    return (
        <table className={classNames.join(" ")}>
            <Headers columns={columns} hasDeleteButton={hasDeleteButton} />
            <tbody>
                {data.map(row =>
                    <Row key={counter++} columns={columns} data={row} isClickable={isClickable} />
                )}
            </tbody>
        </table>
    );
}

const formatValue = val => {
    if (val instanceof Date) {
        return val.toDateString();
    }

    if (val === null) {
        return "<null>";
    }

    switch (typeof val) {
        case "undefined":
            return "<undefined>";
    }

    return val.toString();
}

const Row = ({ data, columns, isClickable }) =>
    <tr data-url={isClickable ? data.url : ""}>
        {columns.map(e =>
            <td key={counter++}>{formatValue(data[e])}</td>
        )}
        {data.deleteUrl &&
            <td data-deleteurl={data.deleteUrl} className="delete-item"></td>}
    </tr>;

const Headers = ({ columns, hasDeleteButton }) =>
    <thead className="thead-dark">
        <tr>
            {columns.map(c =>
                <th key={counter++}>{c}</th>
            )}
            {hasDeleteButton &&
                <th></th>}
        </tr>
    </thead>;

