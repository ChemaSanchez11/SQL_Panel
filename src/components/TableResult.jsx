import React, {useEffect, useRef} from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import uniqid from 'uniqid';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';


const TableResult = ({ main }) => {

    const columns = Object.keys(main.rows[0]).map((key) => ({
        name: key,
        selector: key,
        sortable: true,
    }));


    const data = Object.values(main.rows).map((row) => {
        const formattedRow = {};
        Object.keys(row).forEach((key) => {
            formattedRow[key] = row[key];
        });
        return formattedRow;
    });


    async function expandJson() {
        await new Promise(resolve => setTimeout(resolve, 100));
        hljs.highlightAll();
    }

    const ExpandedComponent = ({ data }) =>
        <pre><code className="json">
        {JSON.stringify(data, null, 2)}
        </code></pre>;

    createTheme('sql_panel', {
        text: {
            primary: 'rgba(255,255,255,0.87)',
            secondary: 'rgba(255,255,255,0.75)',
            disabled: 'rgba(255,253,253,0.47)',
        },
        background: {
            default: '#3c4349',
        },
        context: {
            background: '#3c4349',
            text: 'rgb(255,255,255)',
        },
        divider: {
            default: 'rgba(213,212,212,0.49)',
        },
        button: {
            default: 'rgba(84,220,85,0.95)',
            focus: '#454A52FF',
            hover: '#454A52FF',
            disabled: 'rgba(166,166,166,0.18)',
        },
        selected: {
            default: '#454a52',
            text: 'rgb(255,255,255)',
        },
        highlightOnHover: {
            default: '#454a52',
            text: 'rgb(255,255,255)',
        },
        striped: {
            default: '#343a40',
            text: 'rgb(255,255,255)',
        },
    }, 'dark');

    return (
        <DataTable
            columns={columns}
            data={data}
            keyField={uniqid()}
            pagination
            paginationRowsPerPageOptions={[20, 50, 100]}
            striped={true}
            responsive={true}
            highlightOnHover={true}
            expandableRows={true}
            expandableRowsComponent={ExpandedComponent}
            // onRowClicked={(event) => console.log(event)}
            onRowExpandToggled={() => expandJson()}
            theme="sql_panel"
        />
    );
};

export default TableResult;