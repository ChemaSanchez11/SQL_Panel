import React, { useContext, useEffect, useState } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import uniqid from 'uniqid';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import { PanelContext } from "../contexts/PanelContext.jsx";
import deleteRows from "../helpers/deleteRows.js";
import { toast } from "react-toastify";

/**
 * Componente para mostrar una tabla de datos.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {Object} props.main - Objeto que contiene los datos principales de la tabla.
 * @returns {JSX.Element} - Elemento JSX que representa la tabla.
 */
function Table({ main }) {
    const [tableData, setTableData] = useState([]);
    let { current } = useContext(PanelContext).currentContext;

    /**
     * Maneja el borrado de una fila de la tabla.
     *
     * @param {Object} row - Objeto que representa la fila a eliminar.
     * @returns {void}
     */
    function handleRowDelete(row) {
        const updatedData = [];
        let rowDelete = {};
        tableData.forEach((rowData) => {
            // Compara cada propiedad del objeto de la fila con la fila a eliminar
            if (!Object.entries(rowData).every(([key, value]) => row[key] === value)) {
                updatedData.push(rowData);
            } else {
                rowDelete = rowData;
            }
        });

        // Llamamos al servicio deleteRows para eliminar la fila
        deleteRows(current.database, current.table, JSON.stringify(rowDelete))
            .then(result => {
                if (!result.success) {
                    // Muestra un mensaje de error en caso de que falle la eliminación
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
                    // Actualiza los datos de la tabla después de la eliminación exitosa
                    setTableData(updatedData);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // Definición de las columnas de la tabla
    const columns = [
        ...Object.keys(main.rows[0]).map((key) => ({
            name: key,
            selector: (row) => row[key], // Utiliza una función de selección en lugar de la cadena "id"
            sortable: true,
        })),
        {
            name: 'Acciones',
            cell: (row) => (
                <>
                    <a className="btn btn-secondary" onClick={() => handleRowDelete(row)}>
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

        // Comprobar si tiene datos
        let isEmpty = true;
        columns.forEach(column => {
            if (column.name !== 'Acciones') {
                let key = column.name;
                if (formattedData[0][key] !== null) {
                    isEmpty = false;
                }
            }
        });

        //Guardamos los datos para pintarlos en la tabla
        isEmpty ? setTableData([]) : setTableData(formattedData);
    }, [main.rows]);

    /**
     * Expande el contenido JSON en la tabla.
     *
     * @returns {Promise<void>}
     */
    async function expandJson() {
        await new Promise(resolve => setTimeout(resolve, 100));
        hljs.highlightAll();
    }

    /**
     * Maneja la copia del texto en el portapapeles.
     *
     * @param {string} query - Consulta a copiar en el portapapeles.
     * @returns {void}
     */
    function handleCopy(query) {

        if (navigator.clipboard && navigator.clipboard.writeText) {
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
                    console.error('Fallo al copiar:', error);
                });
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = query;
            document.body.appendChild(textArea);
            textArea.select();

            try {
                const copied = document.execCommand('copy');
                if (copied) {
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
                } else {
                    console.error('Fallo al copiar');
                }
            } catch (error) {
                console.error('Fallo al copiar', error);
            }

            document.body.removeChild(textArea);
        }
    }

    /**
     * Componente que se muestra al expandir una fila de la tabla.
     *
     * @param {Object} data - Datos de la fila expandida.
     * @returns {JSX.Element} - Elemento JSX que representa la fila expandida.
     */
    function ExpandedComponent({ data }) {
        const keys = Object.keys(data).map(key => `\`${key}\``).join(", ");
        const values = Object.values(data).map(value => {
            return isNaN(value) ? `'${value.replace(/'/g, "''")}'` : (value !== "" ? value : "''");
        }).join(", ");

        return (
            <pre>
                <code className="json">{JSON.stringify(data, null, 2)}</code>
                <br />
                <a className="btn btn-secondary me-2 my-2" title="Copiar" onClick={() => handleCopy(`INSERT INTO \`${current.database}\`.\`${current.table}\` (${keys}) VALUES (${values});`)}>
                    <i className="fa fa-copy text-warning"></i>
                </a>
                <code className="sql mb-2">
                  {`INSERT INTO \`${current.database}\`.\`${current.table}\` (${keys}) VALUES (${values});`}
                </code>
            </pre>
        );
    }

    // Crea un tema personalizado para la tabla
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
}

export default Table;