<?php
require_once __DIR__ . '/config.php';
global $CFG, $DB, $CLIENT, $database;

?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <title>Title</title>
        <link rel="icon" type="image/x-icon" href="./img/icons/favicon.png">
        <link rel="stylesheet" href="css/style.css">

        <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
        <script src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js"></script>
        <script src="https://cdn.datatables.net/1.10.16/js/dataTables.bootstrap4.min.js"></script>
        <script src="lib/lib.js"></script>

        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"
              integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
              crossorigin="anonymous">

        <!-- Optional JavaScript -->
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js"
                integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
                crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js"
                integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
                crossorigin="anonymous"></script>
        <link rel="stylesheet" type="text/css"
              href="http://cdn.datatables.net/plug-ins/3cfcc339e89/integration/bootstrap/3/dataTables.bootstrap.css">

        <!--SweetAlert-->
        <link href="//cdn.jsdelivr.net/npm/sweetalert2@11.4.28/dist/sweetalert2.min.css" rel="stylesheet">
        <script src="//cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js"></script>


        <script>
            var baseUrl = "<?php echo $CFG->wwwroot; ?>";
            var user_mac = "<?php echo GetMAC();?>";
        </script>

    </head>
    <body class="bg-dark">
<!--    <div class="container">-->
<!--        <div id="alert-container">-->
<!--            <div class="alert-messages text-center">-->
<!---->
<!--            </div>-->
<!---->
<!--        </div>-->
<!--    </div>-->


    <nav class="navbar navbar-dark justify-content-start">

        <div id="vertical-line" class="mr-3">
            <a class="navbar-brand" id="add_new_server">
                <img src="./img/icons/server_connection.png" width="45" height="45" alt="" data-toggle="modal"
                     data-target="#modal-addhost">
            </a>
            <a class="navbar-brand" href="#">
                <img src="./img/icons/database_reload.png" width="45" height="45" alt="">
            </a>
        </div>

        <a class="navbar-brand" href="#">
            <img src="./img/icons/query.png" width="45" height="45" alt="">
        </a>

        <!--Info-->
        <a class="navbar-brand ml-auto" href="#">
            <img id="status_connect" src="./img/icons/warning.png" width="30" height="30" alt="" data-toggle="modal" data-target="#modal-info">
        </a>
        <a class="navbar-brand" href="#">
            <img src="./img/icons/info.png" width="30" height="30" alt="" data-toggle="modal" data-target="#modal-info">
        </a>

    </nav>

    <div class="bg-dark d-flex">
        <div class="col-p2">
            <ul id='servers' class="list-group bg-dark">

                <?php
                $id_host = $CLIENT->id;
                $servers = $DB->get_records("SELECT * FROM connections WHERE id_host = $id_host");
                $servers = file_get_contents('./db/hosts.json');

                $servers = json_decode($servers);

                //            foreach ($json as $data){
                //                var_dump(decrypt($data->token));
                //            }
                foreach ($servers as $server) {
                    echo "";
                    echo "<li>
                               <a class='conection prevent-select px-3 py-1 w-100 d-inline-block' data-server='$server->token' data-id='$server->id' data-name='$server->host'>
                                   <img id='" . $server->id . "_" . $server->host . "' src='./img/icons/mysql.png' width='24' height='24' alt='' class='align-middle'>
                                   <span class='align-middle' style='font-size: 18px'>$server->host [$server->user]</span>
                               </a>
                               <div id='loading' class='mt-2' style='display: none'>
                                   <div class='spinner m-auto'>
                                        <div class='spinner-circle spinner-circle-outer'></div>
                                        <div class='spinner-circle-off spinner-circle-inner'></div>
                                        <div class='spinner-circle spinner-circle-single-1'></div>
                                        <div class='spinner-circle spinner-circle-single-2'></div>
                                   </div>
                               </div>
                               
                               <ul id='table_" . $server->id . "_" . $server->host . "' class='list-group bg-dark d-none'>                          
                                    
                                </ul>
                               
                           </li>";
                }
                ?>
                <!--            <li>-->
                <!--                <a class="conection prevent-select px-3 py-1 w-100 d-inline-block" data-server="localhost">-->
                <!--                    <img id="localhost" src="./img/icons/mysql.png" width="24" height="24" alt="" class="align-middle">-->
                <!--                    <span class="align-middle" style="font-size: 18px">localhost [Root]</span>-->
                <!--                </a>-->
                <!--            </li>-->

            </ul>
        </div>
        <div id="context-menu" class="no-visible">
            <div class="item" id="close-connection">Cerrar Conexion</div>
            <div class="item">Editar Conexion</div>
            <div class="item">Eliminar Conexion</div>
        </div>
        <div class="col-9" id="container-right">

        </div>
    </div>


    <!-- Modal -->
    <div class="modal fade" id="modal-info" tabindex="-1" role="dialog" aria-labelledby="modal-info" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header my-auto">
                    <img src="./img/icons/favicon.png" width="45" height="45" alt="">
                    <h3 class="modal-title ml-2" id="exampleModalLongTitle">Informacion</h3>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    El registro de las conexiones es guardada mediante el equipo que se utilice, en otro equipo las
                    conexiones cambiaran.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="modal-addhost" tabindex="-1" role="dialog" aria-labelledby="modal-addhost"
         aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header my-auto">
                    <img src="./img/icons/add-host.png" width="50" height="45" alt="">
                    <h3 class="modal-title ml-2" id="exampleModalLongTitle">Informacion</h3>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="new_server" action="lib/services/servers.php" method="post">
                        <div class="form-group">
                            <label for="new_server_host">Host</label>
                            <input type="text" class="form-control" id="new_server_host" name="new_server_host"
                                   placeholder="localhost">
                        </div>
                        <div class="form-group">
                            <label for="new_server_user">Host</label>
                            <input type="text" class="form-control" id="new_server_user" name="new_server_user"
                                   placeholder="root">
                        </div>
                        <div class="form-group">
                            <label for="new_server_pass">Host</label>
                            <input type="password" class="form-control" id="new_server_pass" name="new_server_pass">
                        </div>
                        <div class="form-group">
                            <label for="new_server_port">Host</label>
                            <input type="email" class="form-control" id="new_server_port" name="new_server_port"
                                   aria-describedby="new_server_port" placeholder="3306">
                            <small id="emailHelp" class="form-text text-muted">El puerto por defecto de los servidores
                                SQL es el 3306.</small>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-dismiss="modal">Guardar</button>
                </div>
            </div>
        </div>
    </div>
    <p id="adjust-width" style="width: fit-content;
padding: 0;
font-size: 1.5em;
text-align: initial;"> </p>
    </body>
    </html>
<?php

