import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import databasePNG from '/icons/database.png'
import getTables from "../helpers/getTables.js";
import Swal from "sweetalert2";

function DatabaseList({database, order, servers, setServers}) {


    async function handleGetTables(event) {
        event.preventDefault();
        event.stopPropagation();

        let element = event.target.closest('a');
        let database = element.dataset.database;
        let order = element.dataset.order;

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

        getTables({database})
            .then(result => {

                console.log(result);

                element.removeChild(loadingDiv);

                let serverConnect = null;

                if (result.success) {

                    // Actualizar el objeto con id seleccionada
                    const serversCopyArray = servers.map(server => {
                        if (server.id === parseInt(event.target.closest('ul').dataset.id)) {
                            serverConnect = server.host;
                            //server.databases[order]

                            const databasesCopyArray = server.databases.map(database => {
                                if (database.order === parseInt(order)) {
                                    return {...database, tables: result.output.tables };
                                } else {
                                    return database;
                                }
                            });
                            return {...server, databases: databasesCopyArray, active: true };
                        } else {
                            return {...server, active: false};
                        }
                    });

                    // Actualizar el estado de React con el nuevo array modificado
                    setServers(serversCopyArray);

                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })

                    Toast.fire({
                        icon: 'success',
                        title: `Conexion establecida con ${serverConnect}`
                    })

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
        <li key={database.name} className='ms-3' onDoubleClick={handleGetTables}>
            {console.log(database)}
            <a className='conection prevent-select px-3 py-1 w-100 d-inline-block' data-database={database.name} data-order={order}>
                <img src={databasePNG}
                     width='24' height='24' alt='' className='align-middle'/>
                <span className='align-middle'
                      style={{fontSize: "14px"}}> {`${database.name}`}</span>
            </a>

        </li>
    )
}

export default DatabaseList;
