import React, {useEffect, useState} from "react";
import getServers from "../helpers/getServers.js";
import mysql from '/icons/mysql.png'
import mysql_connect from '/icons/mysql_connection.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import connectServer from "../helpers/connectServer.js";
import Swal from "sweetalert2";
import DatabaseList from "./DatabaseList.jsx";

function ServerList({servers, setServers, setStatus}) {

    // -- Declaracion de los Efectos
    useEffect(() => {
        getServers()
            .then(servers => {
                if (typeof servers !== 'undefined' && servers.success) {
                    if (servers.output.length) setServers(JSON.parse(servers.output));
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Cargando Los Servidores',
                        text: typeof servers !== 'undefined' ? servers.output : 'Error al conectar',
                        showConfirmButton: false,
                        showCancelButton: true,
                        cancelButtonText: 'Cerrar',
                    })
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    async function handleConnect(event) {
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

        let server = element.dataset.server;
        connectServer({server})
            .then(result => {

                element.removeChild(loadingDiv);

                let serverConnect = null;

                if (result.success) {
                    // Actualizar el objeto con id seleccionada
                    const serversCopyArray = servers.map(server => {
                        if (server.id === parseInt(element.dataset.id)) {
                            serverConnect = server.host;
                            return {...server, databases: result.output.databases, active: true };
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

                    setStatus(true);

                } else {

                    setStatus(false);

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: typeof result !== 'undefined' ? result.output : 'Error al conectar',
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
        <>
            <div className="col-p2">
                <ul id='servers' className="list-group bg-dark">
                    {servers.map((server) => {
                            return (
                                <li key={server.token} onDoubleClick={handleConnect} className={`${server.active ? 'connected' : 'd-block'}`}>
                                    <a className='server conection prevent-select px-3 py-1 w-100 d-inline-block'
                                       data-server={server.token} data-id={server.id} data-name={server.host}>
                                        <img id={server.token + '_' + server.host} src={server.active ? mysql_connect : mysql}
                                             width='24' height='24' alt='' className='align-middle'/>
                                        <span className='align-middle'
                                              style={{fontSize: "18px"}}> {`${server.host} [${server.user}]`}</span>
                                    </a>
                                    <div id='loading' className='mt-2' style={{display: "none"}}>
                                        <div className='spinner m-auto'>
                                            <div className='spinner-circle spinner-circle-outer'/>
                                            <div className='spinner-circle-off spinner-circle-inner'/>
                                            <div className='spinner-circle spinner-circle-single-1'/>
                                            <div className='spinner-circle spinner-circle-single-2'/>
                                        </div>
                                    </div>

                                    <ul id={`'table_${server.id}_${server.host}`} data-id={server.id} className={`list-group bg-dark ${server.active ? 'd-block' : 'd-none'}`}>
                                        {
                                            server.databases.map((database, order) => {
                                                return <DatabaseList key={database.name} database={database} order={order} servers={servers} setServers={setServers} />
                                            })
                                        }
                                    </ul>

                                </li>
                            )
                        }
                    )}

                </ul>
            </div>
            <div id="context-menu" className="no-visible">
                <div className="item" id="close-connection">Cerrar Conexion</div>
                <div className="item">Editar Conexion</div>
                <div className="item">Eliminar Conexion</div>
            </div>
        </>
    )
}

export default ServerList;
