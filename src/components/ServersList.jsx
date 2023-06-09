import React, {useContext, useEffect, useState} from "react";
import getServers from "../helpers/getServers.js";
import mysql from '/icons/mysql.png'
import mysql_connect from '/icons/mysql_connection.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import connectServer from "../helpers/connectServer.js";
import Swal from "sweetalert2";
import DatabaseList from "./DatabaseList.jsx";
import {PanelContext, usePanelContext} from "../contexts/PanelContext.jsx";

/**
 * Componente que muestra la lista de servidores.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {function} props.setStatus - Función para establecer el estado de la aplicacion.
 * @param {function} props.setMain - Función para establecer el main de la aplicacion.
 * @returns {JSX.Element} El elemento JSX que representa la lista de servidores.
 */
function ServerList({setStatus, setMain}) {

    let [isMenuOpen, setIsMenuOpen] = useState(false);
    let [serverInitial, setServerInitial] = useState({});

    let {user, setUser} = usePanelContext().userContext;
    let { current, setCurrent } = useContext(PanelContext).currentContext;
    let {servers, setServers} = usePanelContext().serversContext;

    // -- Declaracion de los Efectos
    useEffect(() => {
        //Traemos los servidores del usuario
        getServers(user.id)
            .then(servers => {
                if (typeof servers !== 'undefined' && servers.success) {
                    if (servers.output.length) {
                        setServers(servers.output); //Lista de servidores que se muestra
                    }
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

    /**
     * @description Se ejecuta cuando se realiza la conexión a un servidor.
     * Añadimos un loading mientras se realiza la conexión al servidor y actualiza el estado las conexiones marcandola como activa.
     * Muestra con swal notificaciones de error o exito.
     *
     * @param {Event} event
     * @returns {void}
     */
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
                        if (server.id === element.dataset.id) {
                            serverConnect = server.host;

                            //Seteamos el contexto con el servidor
                            setCurrent({server: server.host});

                            return {...server, arr_databases: result.output.databases, active: true};
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

                    //Ponemos el icono de estado a sin errores
                    setStatus(true);

                } else {

                    //Ponemos el icono de estado a error
                    setStatus(false);

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: typeof result !== 'undefined' ? result.output : 'Error al conectar con la base de datos',
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
        <div className='bg-dark d-flex px-0 col-md-2'>
            <button className='btn btn-dark d-md-none' onClick={() => setIsMenuOpen(!isMenuOpen)} aria-expanded={isMenuOpen}>
                <i className="fa-solid fa-bars"></i>
            </button>
            <ul id='servers' className={`list-group bg-dark ${isMenuOpen ? 'd-md-block' : 'd-none d-md-block'}`}>
                {/*Recorremos el array con todos los servidores de ese usuario y los pintamos*/}
                {servers.map((server) => {
                    return (
                        <li key={server.token} onDoubleClick={handleConnect} className={`${server.active ? 'connected' : 'd-block'}`}>
                            <a className='server conection prevent-select px-3 py-1 w-100 d-inline-block' data-server={server.token} data-id={server.id} data-name={server.host}>
                                <img id={server.token + '_' + server.host} src={server.active ? mysql_connect : mysql} width='24' height='24' alt='' className='align-middle'/>
                                <span className='align-middle' style={{ fontSize: '18px' }}>
                                    {`${server.host} [${server.user}]`}
                                </span>
                            </a>
                            <div id='loading' className='mt-2' style={{ display: 'none' }}>
                                <div className='spinner m-auto'>
                                    <div className='spinner-circle spinner-circle-outer'/>
                                    <div className='spinner-circle-off spinner-circle-inner'/>
                                    <div className='spinner-circle spinner-circle-single-1'/>
                                    <div className='spinner-circle spinner-circle-single-2'/>
                                </div>
                            </div>

                            <ul data-id={server.id} className={`list-group bg-dark ${server.active ? 'd-block' : 'd-none'}`}>
                                {
                                    // Recorremos el array con las database de ese servidor y las pintamos
                                    server.arr_databases.map((database, order) => {
                                        return <DatabaseList key={database.name} database={database} order={order} setMain={setMain}/>
                                    })
                                }
                            </ul>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default ServerList;
