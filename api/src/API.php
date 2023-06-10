<?php
require_once(__DIR__ . '/../lib/functions.php');
require_once(__DIR__ . '/../lib/ConnectionPool.php');

header('Content-Type: application/json');

class API
{

    //CONEXIONES INTERNAS
    public function get_servers()
    {
        global $DB;

        $user_id = $_POST['user_id'];
        header("HTTP/1.1 200 OK");
        return json_encode(['success' => true, 'error' => 0, 'output' => $DB->get_conections("SELECT * FROM host WHERE user_id = $user_id")]);
    }

    public function add_server()
    {
        global $DB;

        if (
            !empty($_POST) &&
            (!isset($_POST['new_server_host']) || !empty($_POST['new_server_host'])) &&
            (!isset($_POST['new_server_user']) || !empty($_POST['new_server_user'])) &&
            (!isset($_POST['new_server_port']) || !empty($_POST['new_server_port'])) &&
            (!isset($_POST['user_id']) || !empty($_POST['user_id']))
        ) {

            header("Content-type:application/json");

            $host = empty($_POST['new_server_host']) ? 'localhost' : $_POST['new_server_host'];
            $user = empty($_POST['new_server_user']) ? 'root' : $_POST['new_server_user'];
            $pass = empty($_POST['new_server_pass']) ? '' : $_POST['new_server_pass'];
            $port = empty($_POST['new_server_port']) ? 3306 : $_POST['new_server_port'];
            $ip = $_SERVER['REMOTE_ADDR'];
            $token = encrypt($ip . '_' . $host . '_' . $user . '_' . $pass . '_' . $port);
            $user_id = $_POST['user_id'];

            $DB->insert("INSERT INTO host (token, ip, host, user, password, port, arr_databases, active, visible, user_id) VALUES ('$token', '$ip', '$host', '$user', '$pass', '$port', '[]', true, 'yes', $user_id);");
            header("HTTP/1.1 200 OK");
            return json_encode(['success' => true, 'error' => 0, 'output' => $DB->get_conections("SELECT * FROM host WHERE user_id = $user_id")]);

        } else {
            header("HTTP/1.1 400 Bad Request");
            return json_encode(['success' => false, 'error' => 2, 'output' => 'Faltan parametros']);
        }
    }

    public function edit_servers()
    {
        global $DB;

        if (
            !empty($_POST) &&
            (!isset($_POST['new_server_host']) || !empty($_POST['new_server_host'])) &&
            (!isset($_POST['new_server_user']) || !empty($_POST['new_server_user'])) &&
            (!isset($_POST['new_server_port']) || !empty($_POST['new_server_port'])) &&
            (!isset($_POST['user_id']) || !empty($_POST['user_id']))
        ) {
            if ($_POST['type'] == 'update') {
                $host = $_POST['edit_server_host'];
                $user = $_POST['edit_server_user'];
                $pass = $_POST['edit_server_pass'];
                $port = $_POST['edit_server_port'];
                $ip = $_SERVER['REMOTE_ADDR'];
                $token = encrypt($ip . '_' . $host . '_' . $user . '_' . $pass . '_' . $port);
                $id = $_POST['id'];
                $user_id = $_POST['user_id'];

                $DB->execute("
                UPDATE host
                SET token = '$token',
                    host = '$host',
                    user = '$user',
                    password = '$pass',
                    port = $port
                WHERE id = $id;");

                header('Content-type:application/json');
                header("HTTP/1.1 200 OK");
                return json_encode(['success' => true, 'error' => 0, 'output' => $DB->get_conections("SELECT * FROM host WHERE user_id = $user_id AND id = $id")]);

            } else if ($_POST['type'] == 'delete') {

                $DB->execute('DELETE FROM host WHERE id = ' . $_POST['id']);
                header('Content-type:application/json');
                header("HTTP/1.1 200 OK");
                return json_encode(['success' => true, 'error' => 0]);
            }

        } else {
            header("HTTP/1.1 400 Bad Request");
            header('Content-type:application/json');
            return json_encode(['success' => false, 'error' => 2, 'output' => 'Faltan parametros']);
        }
    }

    //CONEXIONES EXTERNAS
    public function connect()
    {

        if (!empty($_POST)) {
            $host = $_POST['server'];

            $values = decrypt($host);

            $server = explode("_", $values);

            $_SESSION['server'] = $server;

            // Ejemplo de uso:
            $DB = new ConnectionPool('mysql:host=' . $server[1] . ';', $server[2], $server[3]);

            //$enlace = null;
            if ($DB->status) {

                $array_databases = [];

                $i = 0;
                foreach ($DB->get_databases() as $result) {
                    array_push($array_databases, ['order' => $i, 'name' => $result, 'tables' => []]);
                    $i++;
                }

                header("HTTP/1.1 200 OK");
                return json_encode(['success' => true, 'error' => 0, 'output' => ['host' => $server[1], 'databases' => $array_databases]]);
            } else {
                header("HTTP/1.1 400 Bad Request");
                return json_encode(['success' => false, 'error' => 6, 'output' => $DB->error]);
            }
        }
    }

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

    public function get_records()
    {

        if (!empty($_POST)) {

            $server = $_SESSION['server'];

            $dbname = $_POST['table'];

            $DB = new ConnectionPool('mysql:host=' . $server[1] . ';dbname=' . $dbname, $server[2], $server[3]);

            if ($DB->status) {

                try {

                    $tables = $DB->get_records($_POST['value']);
                    header("HTTP/1.1 200   Bad Request");
                    if (query_is_action($_POST['value'])) {
                        return json_encode(['success' => true, 'error' => 0, 'message' => 'Accion completada correctamente']);
                    } else {
                        return json_encode(['success' => true, 'error' => 0, 'output' => ['table' => $_POST['table'], 'rows' => $tables]]);
                    }
                } catch (PDOException $e) {
                    return json_encode(['success' => false, 'error' => $e->getCode(), 'message' => explode('SQLSTATE[' . $e->getCode() . ']: ', $e->getMessage())[1]]);
                }

            } else {
                header("HTTP/1.1 400 Bad Request");
                return json_encode(['success' => false, 'error' => 6, 'output' => $DB->error]);
            }
        }
    }

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