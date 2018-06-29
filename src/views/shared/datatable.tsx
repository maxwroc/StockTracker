import * as React from 'react';

let counter = 0;

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

const Row = ({ data, columns }) =>
    <tr>
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

export const DataTable = ({ data, columns }) =>
    <table className="table table-sm table-hover">
        <Headers columns={columns} />
        <tbody>
            {data.map(row =>
                <Row key={counter++} columns={columns} data={row} />
            )}
        </tbody>
    </table>;