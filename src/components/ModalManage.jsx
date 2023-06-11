import add_host from '/icons/add-host.png';
import {usePanelContext} from "../contexts/PanelContext.jsx";
import React from "react";
import {useForm} from "react-hook-form";
import editServers from "../helpers/editServers.js";
import FormConnections from "./FormConections.jsx";
import editUser from "../helpers/editUser.js";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

function ModalManage() {
    const navigate = useNavigate();

    let {servers, setServers} = usePanelContext().serversContext;
    let {user, setUser} = usePanelContext().userContext;
    const { register, handleSubmit, setError, formState: { errors }, watch } = useForm();

    function editUsers(data){
        if(atob(user.password) !== data.user_password){
            setError('user_password', {
                type: 'wrong_password'
            });
            return false;
        } else {
            data.user_new_password = btoa(data.user_new_password)
            data.type = 'update';
            editUser(data)
                .then(result => {
                    if(result.success){
                        setUser(result.output[0]);
                        toast.success('Usuario editado correctamente!', {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        });
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    function deleteUser(event, user_id){

        event.preventDefault();
        event.stopPropagation();

        let data = {
            type: 'delete',
            id: user_id
        }
        editUser(data)
            .then(result => {
                if(result.success){
                    sessionStorage.clear();
                    navigate("/login");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <div className="modal modal-xl fade" id="modalManage" tabIndex="-1" aria-labelledby="modalManage" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header my-auto">
                        <img src={add_host} width="50" height="45" alt="" />
                        <h3 className="modal-title ml-2" id="modalAddHostLongTitle">Información</h3>
                        <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                            <h5 aria-hidden="true">&times;</h5>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="accordion" id="accordionServer">
                            <h4 className="text-warning mb-3">Gestionar Usuario</h4>
                            <div className="accordion-item" key={user.id}>
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                            data-bs-target={`#collapseOne${user.id}`} aria-expanded="true"
                                            aria-controls={`collapseOne${user.id}`}>
                                        {`[${user.username}]`}
                                    </button>
                                </h2>
                                <div id={`collapseOne${user.id}`} className="accordion-collapse collapse"
                                     data-bs-parent="#accordionServer">
                                    <div className="accordion-body">
                                        <form className="m-0" onSubmit={handleSubmit(editUsers)} method="post">
                                            <div className="form-group">
                                                <label htmlFor="user_username">Servidor</label>
                                                <input
                                                    type="text"
                                                    defaultValue={user.username}
                                                    className="form-control"
                                                    id="user_username"
                                                    {...register("user_username", { required: true })}
                                                />
                                                {errors.edit_server_host?.type === "required" &&
                                                    <small className="form-text text-danger">
                                                        Debe introducir la URL del servidor
                                                    </small>
                                                }
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="user_password">Contraseña Antigua</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="user_password"
                                                    {...register("user_password", { required: true })}
                                                />
                                                {errors.user_password?.type === "required" &&
                                                    <small className="form-text text-danger">
                                                        Debe introducir su contraseña antigua
                                                    </small>
                                                }

                                                {errors.user_password?.type === "wrong_password" &&
                                                    <small className="form-text text-danger">
                                                        Contraseña antigua incorrecta
                                                    </small>
                                                }
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="user_new_password">Nueva Contraseña</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="user_new_password"
                                                    {...register("user_new_password", { required: true })}
                                                />
                                                {errors.user_new_password?.type === "required" &&
                                                    <small className="form-text text-danger">
                                                        Debe introducir su nueva contraseña
                                                    </small>
                                                }
                                            </div>
                                            <input type="hidden" defaultValue={user.id} {...register("id")} />
                                            <div className="d-flex">
                                                <input type="submit" onClick={(event) => deleteUser(event, user.id)}
                                                       className="btn btn-danger d-flex mt-1" data-bs-dismiss="modal" value="Eliminar Cuenta"/>
                                                <input type="submit" className="btn btn-success d-flex mt-1 ms-auto"
                                                       value="Guardar"/>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <h4 className="text-warning my-3">Gestionar Conexiones</h4>
                            {servers.map((server) => {
                                return <FormConnections key={server.id} server={server}></FormConnections>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalManage;
