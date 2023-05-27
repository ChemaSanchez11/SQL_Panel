import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import tablePNG from '/icons/table.png'
import getRows from "../helpers/getRows.js";
import Swal from "sweetalert2";



function TableList({table, setMain}) {

    async function handleGetRows(event) {
        event.preventDefault();
        event.stopPropagation();

        let element = event.target.closest('a');

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

        element.appendChild(loadingDiv);

        let data = {
            table: element.dataset.table,
            database: element.dataset.database
        }

        getRows(data)
            .then(result => {

                element.removeChild(loadingDiv);

                if (result.success) {
                    result.type = 'table';
                    setMain(result.output);
                } else {

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: typeof result !== 'undefined' ? result.output : 'Error obteniendo las tablas',
                        showConfirmButton: false,
                        showCancelButton: true,
                        cancelButtonText: 'Cerrar',
                    })
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <li key={table.table} onDoubleClick={handleGetRows}>
            <a className='conection prevent-select px-3 py-1 w-100 d-inline-block' data-table={table.table} data-database={table.database}>
                <img src={tablePNG}
                     width='24' height='24' alt='' className='align-middle'/>
                <span className='align-middle'
                      style={{fontSize: "14px"}}> {`${table.table}`}</span>
            </a>
        </li>
    )
}

export default TableList;
