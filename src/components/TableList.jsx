import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import tablePNG from '/icons/table.png';
import getRows from "../helpers/getRows.js";
import Swal from "sweetalert2";
import { usePanelContext } from "../contexts/PanelContext.jsx";

/**
 * Componente para las tablas de una database.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {Object} props.table - Objeto con datos de la tabla.
 * @param {Object} props.setMain - Función para los datos de la tabla en el datatable de main.
 * @returns {JSX.Element} - Elemento JSX que representa las tablas.
 */
function TableList({ table, setMain }) {
    let { current, setCurrent } = usePanelContext().currentContext;

    async function handleGetRows(event) {
        event.preventDefault();
        event.stopPropagation();

        let element = event.target.closest('a');
        let elementMain = document.getElementById('main');

        let loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading';
        loadingDiv.className = 'mt-4';
        loadingDiv.innerHTML = `
            <div class="spinner m-auto">
              <div class="spinner-circle spinner-circle-outer"></div>
              <div class="spinner-circle-off spinner-circle-inner"></div>
              <div class="spinner-circle spinner-circle-single-1"></div>
              <div class="spinner-circle spinner-circle-single-2"></div>
            </div>
        `;

        elementMain.appendChild(loadingDiv);

        let data = {
            table: element.dataset.table,
            database: element.dataset.database
        }

        getRows(data) // Para obtener los datos de la tabla
            .then(result => {
                setCurrent({ // Actualizamos el contexto con la tabla, la base de datos y el servidor actual
                    table: data.table,
                    database: data.database,
                    server: current.server
                });

                elementMain.removeChild(loadingDiv);

                if (result.success) {
                    result.type = 'table';
                    setMain(result.output); // Actualizamos el estado 'setMain' con los datos de la tabla obtenidos
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: typeof result !== 'undefined' ? result.output : 'Error obteniendo las tablas',
                        showConfirmButton: false,
                        showCancelButton: true,
                        cancelButtonText: 'Cerrar',
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        // Se pinta todas las tablas de esa database
        <li key={table.table} onDoubleClick={handleGetRows}>
            <a className='conection prevent-select px-3 py-1 w-100 d-inline-block text-truncate' data-table={table.table} data-database={table.database}>
                <img src={tablePNG} width='24' height='24' alt='' className='align-middle' />
                <span className='align-middle text-truncate' style={{ fontSize: "14px"}}> {`${table.table}`}</span>
            </a>
        </li>
    )
}

export default TableList;
