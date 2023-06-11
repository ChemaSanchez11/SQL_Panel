<?php
require_once(__DIR__ . '/../lib/functions.php');
require_once(__DIR__ . '/../lib/ConnectionPool.php');

header('Content-Type: application/json');

class API
{

    //CONEXIONES INTERNAS
    /**
     * Obtiene los servidores del usuario.
     *
     * @return string JSON con los servidores obtenidos.
     */
    public function get_servers()
    {
        global $DB; // Clase MariaDB de conexiones internas

        $user_id = $_POST['user_id'];

        // Obtenemos las conexiones de la base de datos para el usuario
        $servers = $DB->get_conections("SELECT * FROM host WHERE user_id = $user_id AND visible = 1;");

        header("HTTP/1.1 200 OK");
        // Devolvemos una respuesta JSON con los servidores obtenidos
        return json_encode(['success' => true, 'error' => 0, 'output' => $servers]);
    }

    /**
     * Añade un servidor al usuario.
     *
     * @return string JSON con los servidores obtenidos.
     */
    public function add_server()
    {
        global $DB; // Clase MariaDB de conexiones internas

        if (
            !empty($_POST) &&
            (!isset($_POST['new_server_host']) || !empty($_POST['new_server_host'])) &&
            (!isset($_POST['new_server_user']) || !empty($_POST['new_server_user'])) &&
            (!isset($_POST['new_server_port']) || !empty($_POST['new_server_port'])) &&
            (!isset($_POST['user_id']) || !empty($_POST['user_id']))
        ) {

            $host = empty($_POST['new_server_host']) ? 'localhost' : $_POST['new_server_host'];
            $user = empty($_POST['new_server_user']) ? 'root' : $_POST['new_server_user'];
            $pass = empty($_POST['new_server_pass']) ? '' : $_POST['new_server_pass'];
            $port = empty($_POST['new_server_port']) ? 3306 : $_POST['new_server_port'];
            $ip = $_SERVER['REMOTE_ADDR'];
            $token = encrypt($ip . '_' . $host . '_' . $user . '_' . $pass . '_' . $port);
            $user_id = $_POST['user_id'];

            $DB->insert("INSERT INTO host (token, ip, host, user, password, port, arr_databases, visible, user_id) VALUES ('$token', '$ip', '$host', '$user', '$pass', '$port', '[]', 1, $user_id);");

            header("HTTP/1.1 200 OK");

            // Devolvemos una respuesta JSON con los servidores obtenidos
            return json_encode(['success' => true, 'error' => 0, 'output' => $DB->get_conections("SELECT * FROM host WHERE user_id = $user_id AND visible = 1")]);

        } else {
            header("HTTP/1.1 400 Bad Request");
            return json_encode(['success' => false, 'error' => 2, 'output' => 'Faltan parametros']);
        }
    }

    /**
     * Edita/Elimina el servidor seleccionado del usuario.
     *
     * @return string JSON con los servidores obtenidos.
     */
    public function edit_servers()
    {
        global $DB; // Clase MariaDB de conexiones internas

        if (
            !empty($_POST) &&
            (!isset($_POST['new_server_host']) || !empty($_POST['new_server_host'])) &&
            (!isset($_POST['new_server_user']) || !empty($_POST['new_server_user'])) &&
            (!isset($_POST['new_server_port']) || !empty($_POST['new_server_port'])) &&
            (!isset($_POST['user_id']) || !empty($_POST['user_id']))
        ) {
            if ($_POST['type'] == 'update') { // Si la accion es update actualizamos con los nuevos datos
                $host = $_POST['edit_server_host'];
                $user = $_POST['edit_server_user'];
                $pass = $_POST['edit_server_pass'];
                $port = $_POST['edit_server_port'];
                $ip = $_SERVER['REMOTE_ADDR'];
                $token = encrypt($ip . '_' . $host . '_' . $user . '_' . $pass . '_' . $port);
                $id = $_POST['id'];
                $user_id = $_POST['user_id'];

                // Preparamos la query con los parametros para evitar inyeccion de codigo
                $query = "UPDATE host SET `token` = ?, `host` = ?, `password` = ?, `port` = ? WHERE id = ?;";
                $params = [$token, $host, $pass, $port, $id];

                $result = $DB->execute($query, $params);

                if($result){
                    header("HTTP/1.1 200 OK");
                    return json_encode(['success' => true, 'error' => 0, 'output' => $DB->get_conections("SELECT * FROM host WHERE user_id = $user_id AND id = $id")]);
                } else {
                    header("HTTP/1.1 400 Bad Request");
                    return json_encode(['success' => false, 'error' => 2, 'output' => 'Error al preparar la query']);
                }


            } else if ($_POST['type'] == 'delete') {
                // Preparamos la query con los parametros para evitar inyeccion de codigo
                $query = 'UPDATE host SET visible = 0 WHERE id = ?';
                $params = [$_POST['id']];
                $result = $DB->execute($query, $params);

                if($result){
                    header("HTTP/1.1 200 OK");
                    return json_encode(['success' => true, 'error' => 0]);
                } else {
                    header("HTTP/1.1 400 Bad Request");
                    return json_encode(['success' => false, 'error' => 2, 'output' => 'Error al preparar la query']);
                }
            }

        } else {
            header("HTTP/1.1 400 Bad Request");
            return json_encode(['success' => false, 'error' => 2, 'output' => 'Faltan parametros']);
        }
    }

    //CONEXIONES EXTERNAS

    /**
     * Se conecta a la conexion del usuario
     *
     * @return string JSON con las databases de ese servidor.
     */
    public function connect()
    {
        if (!empty($_POST)) {
            $host = $_POST['server'];

            // Decodeamos la conexion del usuario para conectarnos
            $values = decrypt($host);
            $server = explode("_", $values);


            // Utilizamos ConnectionPool para conectarnos ya que las conexiones son persistentes
            $DB = new ConnectionPool('mysql:host=' . $server[1] . ';', $server[2], $server[3]);

            // Si se ha conectado devolvemos las databases de ese servidor
            if ($DB->status) {

                // La guardamos en sesion
                $_SESSION['server'] = $server;

                $array_databases = [];

                $i = 0;
                foreach ($DB->get_databases() as $result) {
                    array_push($array_databases, ['order' => $i, 'name' => $result, 'tables' => []]);
                    $i++;
                } //Al obtener las databases lo saco de la tabla information_schema y entonces esta no esta, la añadimos manualmente con el siguiente order
                array_push($array_databases, ['order' => $i, 'name' => 'information_schema', 'tables' => []]);

                header("HTTP/1.1 200 OK");
                return json_encode(['success' => true, 'error' => 0, 'output' => ['host' => $server[1], 'databases' => $array_databases]]);
            } else { // Si da error en la conexion devolvemos el error
                header("HTTP/1.1 400 Bad Request");
                return json_encode(['success' => false, 'error' => 6, 'output' => $DB->error]);
            }
        }
    }

    /**
     * Obtener las tablas de esa database
     *
     * @return string JSON con las tablas de esa database.
     */
    public function get_tables()
    {

        if (!empty($_POST)) {

            $server = $_SESSION['server'];

            $DB = new ConnectionPool('mysql:host=' . $server[1] . ';', $server[2], $server[3]);

            if ($DB->status) {
                $tables = $DB->show_tables($_POST['database']);

                header("HTTP/1.1 200 OK");
                return json_encode(['success' => true, 'error' => 0, 'output' => ['database' => $_POST['database'], 'tables' => $tables]]);
            } else {
                header("HTTP/1.1 400 Bad Request");
                return json_encode(['success' => false, 'error' => 6, 'output' => $DB->error]);
            }
        }
    }

    /**
     * Obtener los datos de esa tabla
     *
     * @return string JSON con los datos de esa tabla.
     */
    public function get_rows()
    {

        if (!empty($_POST)) {

            $server = $_SESSION['server'];

            $DB = new ConnectionPool('mysql:host=' . $server[1] . ';', $server[2], $server[3]);

            //$enlace = null;
            if ($DB->status) {

                $tables = $DB->get_rows($_POST['table'], $_POST['database']);

                header("HTTP/1.1 200 OK");
                return json_encode(['success' => true, 'error' => 0, 'output' => ['table' => $_POST['table'], 'rows' => $tables]]);
            } else {
                header("HTTP/1.1 400 Bad Request");
                return json_encode(['success' => false, 'error' => 6, 'output' => $DB->error]);
            }
        }
    }

    /**
     * Ejecutar una query en la database seleccionada
     *
     * @return string JSON con los datos de la tabla si no es accion, si es accion devolvemos estado.
     */
    public function get_records()
    {

        if (!empty($_POST)) {

            $server = $_SESSION['server'];

            $dbname = $_POST['database'];

            $DB = new ConnectionPool('mysql:host=' . $server[1] . ';dbname=' . $dbname, $server[2], $server[3]);

            if ($DB->status) {

                try {

                    $tables = $DB->get_records($_POST['value']);

                    header("HTTP/1.1 200 OK");
                    if (query_is_action($_POST['value'])) { //Si es una accion no devolvemos datos
                        return json_encode(['success' => true, 'error' => 0, 'message' => 'Accion completada correctamente']);
                    } else {
                        return json_encode(['success' => true, 'error' => 0, 'output' => ['database' => $_POST['database'], 'rows' => $tables]]);
                    }
                } catch (PDOException $e) {
                    header("HTTP/1.1 400 Bad Request");
                    return json_encode(['success' => false, 'error' => $e->getCode(), 'message' => explode('SQLSTATE[' . $e->getCode() . ']: ', $e->getMessage())[1]]);
                }

            } else {
                header("HTTP/1.1 400 Bad Request");
                return json_encode(['success' => false, 'error' => 6, 'output' => $DB->error]);
            }
        }
    }

    /**
     * Eliminar datos de una tabla
     *
     * @return string JSON con los datos de esa tabla despues de eliminar.
     */
    public function delete_rows()
    {

        if (!empty($_POST)) {

            $server = $_SESSION['server'];

            $dbname = $_POST['database'];

            $DB = new ConnectionPool('mysql:host=' . $server[1] . ';dbname=' . $dbname, $server[2], $server[3]);

            if ($DB->status) {

                try {
                    $tables = $DB->delete_rows($_POST['table'], $_POST['value']);
                    header("HTTP/1.1 200 OK");
                    return json_encode(['success' => true, 'error' => 0, 'output' => ['table' => $_POST['table'], 'rows' => $tables]]);
                } catch (PDOException $e) {
                    header("HTTP/1.1 400 Bad Request");
                    return json_encode(['success' => false, 'error' => $e->getCode(), 'message' => explode('SQLSTATE[' . $e->getCode() . ']: ', $e->getMessage())[1]]);
                }

            } else {
                header("HTTP/1.1 400 Bad Request");
                return json_encode(['success' => false, 'error' => 6, 'output' => $DB->error]);
            }
        }
    }
}