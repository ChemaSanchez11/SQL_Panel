import React, {useContext, useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import databasePNG from '/icons/database.png'
import tablePNG from '/icons/table.png'
import getTables from "../helpers/getTables.js";
import Swal from "sweetalert2";
import TableList from "./TableList.jsx";
import {PanelContext} from "../contexts/PanelContext.jsx";
import {useNavigate} from "react-router-dom";

const ContextMenu = ({x, y, table, setClose, setShowContextMenu, onClose}) => {

    const navigate = useNavigate();

    function handleClose(event) {
        setClose(true)
        setShowContextMenu(false);
    }

    return (
        <div className="context-menu" style={{top: y, left: x}}>
            <ul>
                <li onClick={handleClose}>Cerrar {table}</li>
            </ul>
        </div>
    );
};

function DatabaseList({database, order, servers, setServers, setMain}) {

    let {current, setCurrent} = useContext(PanelContext).currentContext; // Usa el hook useContext para acceder al contexto
    const [close, setClose] = useState(false);

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

        getTables({database})
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
                            setCurrent({server: server.host, database});

                            //server.databases[order]


                            const databasesCopyArray = server.arr_databases.map(database => {

                                if (database.order == parseInt(order)) {
                                    return {...database, tables: Object.values(result.output.tables)};
                                } else {
                                    return database;
                                }
                            });
                            return {...server, arr_databases: databasesCopyArray, active: true};
                        } else {
                            return {...server, active: false};
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

    //Menu contexto
    const [contextMenuPos, setContextMenuPos] = useState({x: 0, y: 0});
    const [showContextMenu, setShowContextMenu] = useState(false);

    const handleContextMenu = (event) => {
        event.preventDefault();
        const clickX = event.clientX;
        const clickY = event.clientY;

        setContextMenuPos({x: clickX, y: clickY});
        setShowContextMenu(true);
    };

    const handleCloseContextMenu = () => {
        setShowContextMenu(false);
    };

    useEffect(() => {
        const handleClick = (event) => {
            if (showContextMenu && !event.target.closest('.context-menu')) {
                handleCloseContextMenu();
                setContextMenuPos({x: 0, y: 0});
            }
        };

        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [showContextMenu]);

    return (
        <>
            <li key={database.name} className='ms-3' onDoubleClick={handleGetTables} onContextMenu={handleContextMenu}>

                <a className='conection prevent-select px-3 py-1 w-100 d-inline-block' data-database={database.name}
                   data-order={order}>
                    <img src={databasePNG}
                         width='24' height='24' alt='' className='align-middle'/>
                    <span className='align-middle'
                          style={{fontSize: "14px"}}> {`${database.name}`}</span>

                </a>
            </li>
            {showContextMenu && (
                <ContextMenu
                    className={`context-menu ${showContextMenu ? 'd-flex' : 'd-none'}`}
                    x={contextMenuPos.x}
                    y={contextMenuPos.y}
                    table={database.name}
                    setClose={setClose}
                    setShowContextMenu={setShowContextMenu}
                    onClose={handleCloseContextMenu}
                />
            )}
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
