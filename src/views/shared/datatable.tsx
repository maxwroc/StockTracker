
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

    let hasDeleteButton = data.some(r => r.deleteUrl);
    let classNames = ["datatable", "table", "table-sm"];

    if (isClickable || hasDeleteButton) {
        addScriptFile("datatable.js");
    }

    if (isClickable) {
        classNames.push("table-hover");
    }

    let headers = columns;
    if (!Array.isArray(columns)) {
        columns = Object.keys(columns);
        headers = columns.map(c => headers[c]);
    }

    return (
        <table className={classNames.join(" ")}>
            <Headers names={headers} hasDeleteButton={hasDeleteButton} />
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

const Headers = ({ names, hasDeleteButton }) =>
    <thead className="thead-dark">
        <tr>
            {names.map(n =>
                <th key={counter++}>{n}</th>
            )}
            {hasDeleteButton &&
                <th></th>}
        </tr>
    </thead>;

