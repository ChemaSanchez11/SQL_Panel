import React, {useContext, useEffect, useState} from 'react';
import DataTable, {createTheme} from 'react-data-table-component';
import uniqid from 'uniqid';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import {PanelContext} from "../contexts/PanelContext.jsx";
import deleteRows from "../helpers/deleteRows.js";
import {toast} from "react-toastify";

const Table = ({main}) => {
    const [tableData, setTableData] = useState([]);
    let {current} = useContext(PanelContext).currentContext;

    const handleRowDelete = (row) => {
        const updatedData = [];
        let rowDelete = {};
        tableData.forEach((rowData) => {
            if (!Object.entries(rowData).every(([key, value]) => row[key] === value)) {
                updatedData.push(rowData);
            } else {
                rowDelete = rowData;
            }
        });


        //Llamamos al servicio deleteRows para eliminar
        deleteRows(current.database, current.table, JSON.stringify(rowDelete))
            .then(result => {
                if (!result.success) {
                    toast.error(result.message, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                } else {
                    setTableData(updatedData);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const columns = [
        ...Object.keys(main.rows[0]).map((key) => ({
            name: key,
            selector: (row) => row[key], // Utilizar una función de selección en lugar de la cadena "id"
            sortable: true,
        })),
        {
            name: 'Acciones',
            cell: (row) => (
                <>
                    <a className="btn btn-secondary"
                       onClick={() => handleRowDelete(row)}
                    >
                        <i className="fa fa-trash text-warning"></i>
                    </a>
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

        //Comprobar si tiene datos
        let isEmpty = true;
        columns.forEach(column => {

            if (column.name !== 'Acciones') {
                let key = column.name;
                if (formattedData[0][key] !== null) {
                    isEmpty = false;
                }
            }

        });

        isEmpty ? setTableData([]) : setTableData(formattedData);

    }, [main.rows]);

    async function expandJson() {
        await new Promise(resolve => setTimeout(resolve, 100));
        hljs.highlightAll();
    }

    function handleCopy(query) {
        navigator.clipboard.writeText(query)
            .then(() => {
                toast.success('QUERY copiada correctamente!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            })
            .catch((error) => {
                console.error("Error al copiar el texto:", error);
            });
    }

    function ExpandedComponent({data}) {

        const keys = Object.keys(data).map(key => `\`${key}\``).join(", ");
        const values = Object.values(data).map(value => {
            return isNaN(value) ? `'${value.replace(/'/g, "''")}'` : (value !== "" ? value : "''");
        }).join(", ");

        return (
            <pre>
                <code className="json">
                    {JSON.stringify(data, null, 2)}
                </code>
                <br/>
                <a className="btn btn-secondary me-2 my-2" title="Copiar" onClick={() => handleCopy(`INSERT INTO \`${current.database}\`.\`${current.table}\` (${keys}) VALUES (${values});`)}>
                        <i className="fa fa-copy text-warning"></i>
                    </a>
                <code className="sql mb-2">
                    {`INSERT INTO \`${current.database}\`.\`${current.table}\` (${keys}) VALUES (${values});`}
                </code>
            </pre>
        )
    }


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
            highlightOnHover={true}
            expandableRows={true}
            expandableRowsComponent={ExpandedComponent}
            onRowExpandToggled={() => expandJson()}
            theme="sql_panel"
        />
    );
};

export default Table;