import React, {useState, useContext} from 'react';
import Table from "./Table.jsx";
import AceEditor from 'react-ace'; //AUNQUE PONGA QUE NO SE USA SI SE UTILIZA PARA LOS TEMAS
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-twilight';
import {PanelContext} from "../contexts/PanelContext.jsx";

import mysql from '/icons/mysql.png';
import mysql_connect from '/icons/mysql_connection.png';
import database_active from '/icons/database_active.png';
import database from '/icons/database_inactive.png';
import run_query from '/icons/run_query.png';

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getRecords from "../helpers/getRecords.js";
import QueryBuilder from "./QueryBuilder.jsx";
import TableResult from "./TableResult.jsx";

/**
 * @description Componente principal que contiene la lógica principal de la aplicación.
 * @param {Object} main - Objeto que contiene los datos principales, para ejecutar query y resultados o para datos de una tabla.
 * @returns {JSX.Element} - Elemento JSX que representa el componente principal.
 */
function Main({main}) {

    let {current} = useContext(PanelContext).currentContext; // Se usa para hacer la consulta a la database actual

    const [values, setValues] = useState({})

    /**
     * @description Funcion que ejecuta esa query en el servidor
     */
    function handleRunQuery() {
        const value = document.getElementsByClassName('ace_line')[0].textContent;
        if(!current.server){
            toast('❓ Seleccione un servidor ', {
                position: "top-center",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
        } else if (!current.database) {
            toast('❓ Seleccione una base de datos ', {
                position: "top-center",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            return false;
        } else {
            getRecords(current.database, value)
                .then(result => {
                    if (typeof result !== 'undefined' && result.success) {
                        //Si es un accion como delete o insert no pintamos la tabla de resultados
                        if(typeof result.message != 'undefined'){
                            let value = {
                                type: 'action_done',
                                message: result.message,
                            }
                            setValues(value);
                        } else {
                            result.output.type = 'query_result';
                            setValues(result.output);
                        }
                    } else if (!result.success) {
                        // Si hay un error en la consulta mostramos la tabla con la informacion del error
                        let value = {
                            type: 'query_error',
                            error: result.message,
                        }
                        setValues(value);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    /**
     * @description Funcion cuando se le da click al boton de informacion de database o servidor.
     * @param {String} type tipo de boton seleccionado.
     */
    function handleClick(type) {
        if (type === 'server') {
            toast(current.server ? ('✅ Servidor: ' + current.server) : '❓ Seleccione un servidor', {
                position: "top-center",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
        } else {
            toast(current.database ? ('✅ Database: ' + current.database) : '❓ Seleccione una base de datos', {
                position: "top-center",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
        }
    }


    if (typeof main !== 'undefined' && typeof main.rows !== 'undefined' && main.type !== 'query') { //Si es para mostrar datos de una tabla
        return (
            <div id="main" className="bg-dark px-0 col-md-10">
                <Table main={main}></Table>
            </div>
        );
    } else if (main.type === 'query') { //Si el tipo es query mostramos el contenedor para ejecutar la query y los resultados
        return (
            <div id="main" className="bg-dark px-0 col-md-10">
                <ToastContainer/>

                <div className="d-flex">
                    {current.server && //Si esta conectado a un servidor muestra en verde
                        <button onClick={() => handleClick('server')} type="button"
                                className="btn btn-current btn-success my-1">
                            <img className="current-ico" src={mysql_connect} alt=""/> <span>{current.server}</span>
                        </button>
                    }

                    {!current.server && //Si no esta conectado muestra el boton en rojo
                        <button onClick={() => handleClick('server')} type="button"
                                className="btn btn-current btn-danger my-1">
                            <img className="current-ico" src={mysql} alt=""/> <span>{current.server}</span>
                        </button>
                    }


                    {current.database && //Si esta conectado a una database muestra en verde y su nombre
                        <button type="button" onClick={handleClick}
                                className="btn btn-current btn-success my-1 ms-2 text-center">
                            <img className="current-ico" src={database_active} alt=""/> <span
                            className="ms-1">{current.database}</span>
                        </button>
                    }

                    {!current.database && //Si no esta conectado muestra el boton en rojo
                        <button type="button" onClick={handleClick}
                                className="btn btn-current btn-danger my-1 ms-2 text-center">
                            <img className="current-ico" src={database} alt=""/>
                        </button>
                    }

                    <button className="btn ms-4 d-flex align-items-center" title="Ejecutar" onClick={handleRunQuery}>
                        <img className="run-ico" src={run_query} alt=""/>
                    </button>

                </div>

                <QueryBuilder/>

                {(values.type === 'query_result' && values.rows) && //Mostrar datatable con resultado de la query
                    <>
                        <TableResult main={values}></TableResult>
                    </>

                }

                {(values.type === 'action_done') && //Mostrar tabla con resultado de la accion

                    <table className="table table-dark">
                        <thead>
                        <tr>
                            <th scope="col">Estado</th>
                            <th scope="col">Mensaje</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">Exito</th>
                            <td><span className="text-success">{values.message}</span></td>
                        </tr>
                        </tbody>
                    </table>

                }

                {(values.error && values.type === 'query_error') && //Mostrar tabla con error en la query

                    <table className="table table-dark">
                        <thead>
                        <tr>
                            <th scope="col">Estado</th>
                            <th scope="col">Mensaje</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">Error</th>
                            <td><span className="text-danger">{values.error}</span></td>
                        </tr>
                        </tbody>
                    </table>

                }
            </div>
        )
    } else {
        return (
            <div id="main" className="bg-dark d-flex px-0 col-md-10">
            </div>
        )
    }
}


export default Main;