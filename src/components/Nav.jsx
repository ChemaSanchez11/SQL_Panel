import server_connection from '/icons/server_connection.png';
import database_reload from '/icons/database_reload.png';
import query from '/icons/query.png';
import warning from '/icons/warning.png';
import done from '/icons/done.png';
import error from '/icons/error.png';
import info from '/icons/info.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import {PanelContext, usePanelContext} from "../contexts/PanelContext.jsx";
import React, {useContext, useEffect, useRef, useState} from "react";
import getRows from "../helpers/getRows.js";
import Swal from "sweetalert2";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router-dom";
import ModalManage from "./ModalManage.jsx";

const ContextMenu = ({ x, y, onClose, setManage }) => {

    const navigate = useNavigate();

    function handleExit(){
        sessionStorage.clear();
        navigate("/login");
    }

    return (
        <div className="context-menu" style={{ top: y, left: x }}>
            <ul>
                <li data-bs-toggle="modal" data-bs-target="#modalManage">Gestionar</li>
                <li onClick={handleExit}>Cerrar Sesion</li>
            </ul>
        </div>
    );
};

function Nav({status, setMain}) {

    //Contexto del usuario
    let {user, setUser} = usePanelContext().userContext;
    let { current } = usePanelContext().currentContext;
    const [manage, setManage] = useState(false);

    function handleQuery(){
        setMain({type: 'query'});
    }

    const handleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        let data = {
            table: current.table,
            database: current.database
        };

        getRows(data)
            .then(result => {
                if (result.success) {
                    result.type = 'table';
                    setMain(result.output);

                    toast( '♻️ Recargado correctamente', {
                        position: "top-right",
                        autoClose: 600,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "dark",
                    });

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: typeof result !== 'undefined' ? result.output : 'Error obteniendo las tablas (RELOAD)',
                        showConfirmButton: false,
                        showCancelButton: true,
                        cancelButtonText: 'Cerrar',
                    });
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    //Menu contexto
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
    const [showContextMenu, setShowContextMenu] = useState(false);

    const handleContextMenu = (event) => {
        event.preventDefault();
        const clickX = event.clientX;
        const clickY = event.clientY;

        setContextMenuPos({ x: clickX-200, y: clickY });
        setShowContextMenu(true);
    };

    const handleCloseContextMenu = () => {
        setShowContextMenu(false);
    };

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


    return (
        <nav className="navbar navbar-dark justify-content-start">

            <div id="vertical-line" className="mx-2">
                <a className="navbar-brand" id="add_new_server" >
                    <img src={server_connection} width="45" height="45" alt="" data-bs-toggle="modal" data-bs-target="#modalAddHost"/>
                </a>
                <a className="navbar-brand" onClick={handleClick}>
                    <img src={database_reload} width="45" height="45" alt=""/>
                </a>
            </div>

            <a className="navbar-brand ms-2" href="#" onClick={handleQuery}>
                <img src={query} width="45" height="45" alt=""/>
            </a>

            <a className="navbar-brand ms-auto" href="#">
                <img id="status_connect" src={status ? done : status === false ? error : warning} width="38rem" height="38rem" alt="" />
            </a>
            <a className="navbar-brand" href="#">
                <img src={info} width="38rem" height="38rem" alt="" data-bs-toggle="modal" data-bs-target="#modalInfo" />
            </a>
            <a className="navbar-brand" href="#" onContextMenu={handleContextMenu}>
                <img id="status_connect" src={'/user_photos/'+user.photo} width="38rem" height="38rem" title={user.username} />
            </a>
            {showContextMenu && (
                <ContextMenu
                    className={`context-menu ${showContextMenu ? 'd-flex' : 'd-none'}`}
                    x={contextMenuPos.x}
                    y={contextMenuPos.y}
                    onClose={handleCloseContextMenu}
                    setManage={setManage}
                />
            )}
            <ModalManage/>
            <ToastContainer></ToastContainer>
        </nav>
    )
}

export default Nav;
