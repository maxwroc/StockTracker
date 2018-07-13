import React = require("react");
import ReactDOM = require("react-dom");

interface DynamicTableProps {
    text?: string;
}

export class DynamicTable extends React.Component<DynamicTableProps, { count: number }> {

    constructor(props: DynamicTableProps) {
        super(props);

        this.state = {
            count: 0
        };
    }

    private handleClick() {
        this.setState((prevState, props) => {
            return { count: prevState.count + 1 }
        });
    }

    render() {
        return (
            <button data-isom="DynamicTable" onClick={this.handleClick.bind(this)}>Clicked {this.state.count} [{this.props.text}]</button>
        );
    }
}

declare var $: any;

// initialization in the browser
if (typeof document != "undefined") {
    $("*[data-isom='DynamicTable']").each(function (index) {
        ReactDOM.hydrate(React.createElement(DynamicTable, {}), this.parentElement);
    });
}