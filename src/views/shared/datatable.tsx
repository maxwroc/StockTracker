import * as React from 'react';
import { addScriptFile } from "../master.page";

let counter = 0;

export interface IDataTableProps {
    data: any[];
    columns: string[] | { [column: string]: string };
    isClickable?: boolean;
}

export const DataTable: IViewConstructor<IDataTableProps> = ({ data, columns, isClickable }) => {
    isClickable && addScriptFile("datatable.js");
    return (
        <table className="datatable table table-sm table-hover">
            <Headers columns={columns} />
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
    </tr>;

const Headers = ({ columns }) =>
    <thead className="thead-dark">
        <tr>
            {columns.map(c =>
                <th key={counter++}>{c}</th>
            )}
        </tr>
    </thead>;

