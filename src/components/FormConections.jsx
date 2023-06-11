import React from "react";
import {useForm} from "react-hook-form";
import editServers from "../helpers/editServers.js";
import {usePanelContext} from "../contexts/PanelContext.jsx";


function FormConnections({server}) {
    const {register, handleSubmit, formState: {errors}, watch} = useForm();
    let {servers, setServers} = usePanelContext().serversContext;

    function saveServer(data) {

        data.type = 'update';

        editServers(data)
            .then(result => {
                if (result.success && result.output.length) {
                    let serversUpdated = [];

                    // Actualizar el objeto con id seleccionada
                    servers.map(server => {
                        if (server.id !== result.output[0].id) {
                            serversUpdated.push(server);
                        } else {
                            serversUpdated.push(result.output[0])
                        }
                    });

                    setServers(serversUpdated);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function deleteServer(event, id) {
        event.preventDefault();
        event.stopPropagation();

        let data = {
            id: id,
            type: 'delete'
        }

        editServers(data)
            .then(result => {
                if (result.success) {
                    let serversUpdated = [];

                    // Actualizar el objeto con id seleccionada
                    servers.map(server => {
                        if (server.id !== data.id) {
                            serversUpdated.push(server);
                        }
                    });

                    setServers(serversUpdated);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    server.active = server.active === true;
    const defaultValues = {
        id: server.id,
        edit_server_host: server.host,
        edit_server_user: server.user,
        edit_server_pass: server.password,
        edit_server_port: 3306,
        user_id: server.user_id
    };

    return (
        <div className="accordion-item" key={server.id}>
            <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target={`#collapseOne${server.id}`} aria-expanded="true"
                        aria-controls={`collapseOne${server.id}`}>
                    {`${server.host} [${server.user}]`}
                </button>
            </h2>
            <div id={`collapseOne${server.id}`} className="accordion-collapse collapse"
                 data-bs-parent="#accordionServer">
                <div className="accordion-body">
                    <h5 className="text-primary">Editando servidor {`${server.host} [${server.user}]`}</h5>
                    <form className="m-0" onSubmit={handleSubmit(saveServer)} method="post">
                        <div className="form-group">
                            <label htmlFor="edit_server_host">Servidor</label>
                            <input
                                type="text"
                                defaultValue={defaultValues.edit_server_host}
                                className="form-control"
                                id="edit_server_host"
                                {...register("edit_server_host", { required: true })}
                                placeholder="localhost"
                            />
                            {errors.edit_server_host?.type === "required" &&
                                <small id="emailHelp" className="form-text text-danger">
                                    Debe introducir la URL del servidor
                                </small>
                            }
                        </div>
                        <div className="form-group">
                            <label htmlFor="edit_server_user">Usuario</label>
                            <input
                                type="text"
                                defaultValue={defaultValues.edit_server_user}
                                className="form-control"
                                id="edit_server_user"
                                {...register("edit_server_user", { required: true })}
                                placeholder="root"
                            />
                            {errors.edit_server_user?.type === "required" &&
                                <small id="emailHelp" className="form-text text-danger">
                                    Debe introducir el usuario
                                </small>
                            }
                        </div>
                        <div className="form-group">
                            <label htmlFor="edit_server_pass">Contraseña</label>
                            <input
                                type="password"
                                defaultValue={defaultValues.edit_server_pass}
                                className="form-control"
                                id="edit_server_pass"
                                {...register("edit_server_pass", { required: false })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="edit_server_port">Puerto</label>
                            <input
                                type="text"
                                defaultValue={defaultValues.edit_server_port}
                                className="form-control"
                                id="edit_server_port"
                                {...register("edit_server_port", { required: true })}
                                aria-describedby="edit_server_port"
                                placeholder="3306"
                            />

                            <small id="emailHelp" className="form-text text-muted">
                                El puerto por defecto de los servidores SQL es el 3306.
                            </small>
                        </div>
                        <input type="hidden" defaultValue={defaultValues.id} {...register("id")} />
                        <input type="hidden" defaultValue={defaultValues.user_id} {...register("user_id")} />
                        <div className="d-flex">
                            <input type="submit" onClick={(event) => deleteServer(event, server.id)} className="btn btn-danger d-flex mt-1" data-bs-dismiss="modal" value="Eliminar"/>
                            <input type="submit" className="btn btn-success d-flex mt-1 ms-auto" data-bs-dismiss="modal" value="Guardar"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormConnections;
