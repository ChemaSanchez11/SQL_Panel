import React, { useContext, useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import databasePNG from '/icons/database.png'
import getTables from "../helpers/getTables.js";
import Swal from "sweetalert2";
import TableList from "./TableList.jsx";
import {PanelContext, usePanelContext} from "../contexts/PanelContext.jsx";

/**
 * @description Componente que muestra el menú contextual.
 *
 * @param {number} x - La posición horizontal del menú contextual.
 * @param {number} y - La posición vertical del menú contextual.
 * @param {string} database - El nombre de la tabla.
 * @param {function} setClose - Función para establecer el estado de cierre.
 * @param {function} setShowContextMenu - Función para establecer el estado de visualización del menú contextual.
 * @param {function} onClose - Función para cerrar el menú contextual.
 * @returns {JSX.Element} El elemento JSX que representa el menú contextual.
 */
function ContextMenu ({ x, y, database, setClose, setShowContextMenu, onClose }) {

    /**
     * @description Maneja el cierre del menú contextual.
     *
     * @param {Event} event - El evento de cierre.
     * @returns {void}
     */
    function handleClose(event) {
        setClose(true)
        setShowContextMenu(false);
    }

    return (
        <div className="context-menu" style={{ top: y, left: x }}>
            <ul>
                <li onClick={handleClose}>Cerrar {database}</li>
            </ul>
        </div>
    );
}

/**
 * @description Componente que muestra la lista de bases de datos.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {Object} props.database - Objecto de cada base de datos de ese servidor.
 * @param {number} props.order - El orden de la base de datos.
 * @param {function} props.setMain - Función para establecer el main de la aplicacion.
 * @returns {JSX.Element} El elemento JSX que representa la lista de bases de datos.
 */
function DatabaseList({ database, order, setMain }) {

    let { current, setCurrent } = useContext(PanelContext).currentContext;
    let {servers, setServers} = usePanelContext().serversContext;
    const [close, setClose] = useState(false);

    // Menu contexto
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
    const [showContextMenu, setShowContextMenu] = useState(false);

    /**
     * @description Maneja el evento de menú contextual.
     *
     * @param {Event} event - El evento de menú contextual.
     * @returns {void}
     */
    function handleContextMenu (event) {
        event.preventDefault();
        const clickX = event.clientX;
        const clickY = event.clientY;

        // Seteamos la posicion donde va a aparecer el menu
        setContextMenuPos({ x: clickX, y: clickY });
        setShowContextMenu(true);
    }

    /**
     * Maneja el cierre del menú contextual.
     *
     * @returns {void}
     */
    function handleCloseContextMenu() {
        setShowContextMenu(false);
    }

    useEffect(() => {
        const handleClick = (event) => {
            if (showContextMenu && !event.target.closest('.context-menu')) {
                handleCloseContextMenu();
                setContextMenuPos({ x: 0, y: 0 });
            }
        };

        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [showContextMenu]);

    /**
     * @description Maneja la obtención de las tablas de una base de datos.
     *
     * @param {Event} event - El evento de obtención de tablas.
     * @returns {void}
     */
    async function handleGetTables(event) {

        setClose(false);

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

        getTables({ database })
            .then(result => {

                setMain({});

                element.removeChild(loadingDiv);

                let serverConnect = null;

                if (result.success) {

                    // Actualizar el objeto con id seleccionada
                    const serversCopyArray = servers.map(server => {

                        if (parseInt(server.id) === parseInt(event.target.closest('ul').dataset.id)) {
                            serverConnect = server.host;

                            //Seteamos el contexto con la database
                            setCurrent({ server: server.host, database });

                            const databasesCopyArray = server.arr_databases.map(database => {
                                if (database.order === parseInt(order)) {
                                    return { ...database, tables: Object.values(result.output.tables) };
                                } else {
                                    return database;
                                }
                            });
                            return { ...server, arr_databases: databasesCopyArray, active: true };
                        } else {
                            return { ...server, active: false };
                        }
                    });


                    // Actualizar el estado de React con el nuevo array modificado
                    setServers(serversCopyArray);

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
        <>
            <li key={database.name} className='ms-3' onDoubleClick={handleGetTables} onContextMenu={handleContextMenu}>
                <a className='conection prevent-select px-3 py-1 w-100 d-inline-block' data-database={database.name} data-order={order}>
                    <img src={databasePNG} width='24' height='24' alt='' className='align-middle'/>
                    <span className='align-middle' style={{ fontSize: "14px" }}> {`${database.name}`}</span>
                </a>
            </li>
            {/*/Si esta abierto el menu lo mostramos para cerrar la database*/}
            {showContextMenu && (
                <ContextMenu className={`context-menu ${showContextMenu ? 'd-flex' : 'd-none'}`} x={contextMenuPos.x} y={contextMenuPos.y} database={database.name} setClose={setClose} setShowContextMenu={setShowContextMenu} onClose={handleCloseContextMenu}/>
            )}
            {/*Si se ha seteado cerrar esa base de datos quedara oculta hasta hacer doble click denuevo*/}
            <ul className={`${close ? 'd-none' : 'd-block'} table-list list-group d-block ms-5`}>
                {
                    database.tables.map((table) => {
                        return (
                            <TableList key={table.table} table={table} setMain={setMain}></TableList>
                        )
                    })
                }
            </ul>
        </>
    )
}

export default DatabaseList;
