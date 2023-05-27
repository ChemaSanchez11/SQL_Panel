import React, { useEffect, useState } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import uniqid from 'uniqid';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

const Table = ({ main }) => {
    const [tableData, setTableData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    const handleRowDelete = (id) => {
        const updatedData = tableData.filter((row) => row.id !== id);
        setTableData(updatedData);
        setSelectedRows([]);
    };

    const handleDeleteSelected = () => {
        const updatedData = tableData.filter((row) => !selectedRows.includes(row.id));
        setTableData(updatedData);
        setSelectedRows([]);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Delete') {
            event.preventDefault();
            handleDeleteSelected();
        }
    };

    const columns = [
        ...Object.keys(main.rows[0]).map((key) => ({
            name: key,
            selector: key,
            sortable: true,
        })),
        {
            name: 'Acciones',
            cell: (row) => (
                <>
                    <button
                        onClick={() => handleRowDelete(row.id)}
                        disabled={!selectedRows.includes(row.id)}
                    >
                        Eliminar
                    </button>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    useEffect(() => {
        const formattedData = Object.values(main.rows).map((row) => {
            const formattedRow = {};
            Object.keys(row).forEach((key) => {
                formattedRow[key] = row[key];
            });
            return formattedRow;
        });
        setTableData(formattedData);
    }, [main.rows]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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
            data={tableData}
            keyField={uniqid()}
            pagination
            striped={true}
            responsive={true}
            selectableRows={true}
            highlightOnHover={true}
            expandableRows={true}
            expandableRowsComponent={ExpandedComponent}
            onSelectedRowsChange={({ selectedRows }) =>
                setSelectedRows(selectedRows.map((row) => row.id))
            }
            theme="sql_panel"
        />
    );
};

export default Table;