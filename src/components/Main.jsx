import React, {useRef, useEffect, useState, useContext} from 'react';
import Table from "./Table.jsx";
import AceEditor from 'react-ace';
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

function Main({main}) {

    let {current} = useContext(PanelContext).currentContext; // Usa el hook useContext para acceder al contexto

    const [values, setValues] = useState({})

    function handleRunQuery() {
        const value = document.getElementsByClassName('ace_line')[0].textContent;
        if (!current.database) {
            toast('❓ Seleccione una base de datos', {
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
                        //Si es un accion como delete o insert
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


    if (typeof main !== 'undefined' && typeof main.rows !== 'undefined' && main.type != 'query') {
        return (
            <div className="bg-dark px-0 col-md-10">
                <Table main={main}></Table>
            </div>
        );
    } else if (main.type === 'query') {
        return (
            <div className="bg-dark px-0 col-md-10">
                <ToastContainer/>

                <div className="d-flex">
                    {current.server &&
                        <button onClick={() => handleClick('server')} type="button"
                                className="btn btn-current btn-success my-1">
                            <img className="current-ico" src={mysql_connect}/> <span>{current.server}</span>
                        </button>
                    }

                    {!current.server &&
                        <button onClick={() => handleClick('server')} type="button"
                                className="btn btn-current btn-danger my-1">
                            <img className="current-ico" src={mysql}/> <span>{current.server}</span>
                        </button>
                    }


                    {current.database &&
                        <button type="button" onClick={handleClick}
                                className="btn btn-current btn-success my-1 ms-2 text-center">
                            <img className="current-ico" src={database_active}/> <span
                            className="ms-1">{current.database}</span>
                        </button>
                    }

                    {!current.database &&
                        <button type="button" onClick={handleClick}
                                className="btn btn-current btn-danger my-1 ms-2 text-center">
                            <img className="current-ico" src={database}/>
                        </button>
                    }

                    <button className="btn ms-4 d-flex align-items-center" title="Ejecutar" onClick={handleRunQuery}>
                        <img className="run-ico" src={run_query}/>
                    </button>

                </div>

                <QueryBuilder/>

                {(values.type === 'query_result' && values.rows) &&
                    <>
                        <TableResult main={values}></TableResult>
                    </>

                }

                {(values.type === 'action_done') &&

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

                {(values.error && values.type === 'query_error') &&

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
            <div className="bg-dark d-flex px-0 col-md-10">
            </div>
        )
    }
}


export default Main;