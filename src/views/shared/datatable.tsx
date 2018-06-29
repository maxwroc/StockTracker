import * as React from 'react';

let counter = 0;

const formatValue = val => {
    if (val instanceof Date) {
        return val.toDateString();
    }

    return val.toString();
}

const Row = ({ data, columns }) =>
    <tr>
        {Object.keys(data._doc)
            .filter(name => !columns || columns.indexOf(name) != -1)
            .map(e => <td key={counter++}>{formatValue(data[e])}</td>)}
    </tr>;

export const DataTable = ({ data, columns }) =>
    <table>
        {data.map(row => <Row key={counter++} data={row} columns={columns} />)}
    </table>;