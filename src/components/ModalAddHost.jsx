import add_host from '/icons/add-host.png';
import {useForm} from "react-hook-form";
import addServer from "../helpers/addServer.js";

function ModalAddHost({ servers , setServers }) {

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            new_server_port: 3306
        }
    });

    function saveServer(data){
        addServer(data)
            .then(servers => {
                if(servers.success){
                    if(servers.output.length) setServers(servers.output);
                } else {
                    alert("ERROR");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (

        <div className="modal fade" id="modalAddHost" tabIndex="-1" aria-labelledby="modalAddHostLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header my-auto">
                        <img src={add_host} width="50" height="45" alt=""/>
                        <h3 className="modal-title ml-2" id="modalAddHostLongTitle">Información</h3>
                        <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                            <h5 aria-hidden="true">&times;</h5>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form id="new_server" onSubmit={handleSubmit(saveServer)} action="lib/services/servers.php" method="post">
                            <div className="form-group">
                                <label htmlFor="new_server_host">Servidor</label>
                                <input type="text"
                                       className="form-control" id="new_server_host"
                                       {...register('new_server_host', { required: true })}
                                       placeholder="localhost"/>
                                {errors.new_server_host?.type === "required" &&
                                    <small id="emailHelp" className="form-text text-danger">
                                    Debe introducir la url del servidor
                                    </small>
                                }
                            </div>
                            <div className="form-group">
                                <label htmlFor="new_server_user">Usuario</label>
                                <input type="text"
                                       className="form-control"
                                       id="new_server_user"
                                       {...register('new_server_user', { required: true })}
                                       placeholder="root"/>
                                {errors.new_server_user?.type === "required" &&
                                    <small id="emailHelp" className="form-text text-danger">
                                        Debe introducir el usuario
                                    </small>
                                }
                            </div>
                            <div className="form-group">
                                <label htmlFor="new_server_pass">Contraseña</label>
                                <input type="password"
                                       className="form-control"
                                       id="new_server_pass"
                                       {...register('new_server_pass', { required: false })}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="new_server_port">Puerto</label>
                                <input type="text"
                                       className="form-control"
                                       id="new_server_port"
                                       {...register('new_server_port', { required: true })}
                                       aria-describedby="new_server_port"
                                       placeholder="3306"/>

                                <small id="emailHelp" className="form-text text-muted">
                                    El puerto por defecto de los servidores SQL es el 3306.
                                </small>
                            </div>
                            <button type="submit" className="btn btn-success d-flex mt-1 ms-auto" data-dismiss="modal">Guardar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>


        // <div className="modal fade" id="modal-addhost" tabIndex="-1" role="dialog" aria-labelledby="modal-addhost"
        //      aria-hidden="true">
        //     <div className="modal-dialog modal-dialog-centered" role="document">
        //         <div className="modal-content">
        //             <div className="modal-header my-auto">
        //                 <img src={add_host} width="50" height="45" alt=""/>
        //                     <h3 className="modal-title ml-2" id="exampleModalLongTitle">Informacion</h3>
        //                     <button type="button" className="close" data-dismiss="modal" aria-label="Close">
        //                         <span aria-hidden="true">&times;</span>
        //                     </button>
        //             </div>
        //             <div className="modal-body">
        //                 <form id="new_server" action="lib/services/servers.php" method="post">
        //                     <div className="form-group">
        //                         <label htmlFor="new_server_host">Host</label>
        //                         <input type="text" className="form-control" id="new_server_host" name="new_server_host"
        //                                placeholder="localhost"/>
        //                     </div>
        //                     <div className="form-group">
        //                         <label htmlFor="new_server_user">Host</label>
        //                         <input type="text" className="form-control" id="new_server_user" name="new_server_user"
        //                                placeholder="root"/>
        //                     </div>
        //                     <div className="form-group">
        //                         <label htmlFor="new_server_pass">Host</label>
        //                         <input type="password" className="form-control" id="new_server_pass"
        //                                name="new_server_pass"/>
        //                     </div>
        //                     <div className="form-group">
        //                         <label htmlFor="new_server_port">Host</label>
        //                         <input type="email" className="form-control" id="new_server_port" name="new_server_port"
        //                                aria-describedby="new_server_port" placeholder="3306"/>
        //                             <small id="emailHelp" className="form-text text-muted">
        //                                 El puerto por defecto de los servidores SQL es el 3306.
        //                             </small>
        //                     </div>
        //                     <button type="submit" className="btn btn-primary">Enviar</button>
        //                 </form>
        //             </div>
        //             <div className="modal-footer">
        //                 <button type="button" className="btn btn-success" data-dismiss="modal">Guardar</button>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}

export default ModalAddHost;
