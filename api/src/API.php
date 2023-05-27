<?php
require_once(__DIR__ . '/../lib/functions.php');
require_once(__DIR__ . '/../lib/ConnectionPool.php');

header('Content-Type: application/json');

class API
{

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

        if (!empty($_POST) && (!isset($_POST['new_server_host']) || !empty($_POST['new_server_host'])) && (!isset($_POST['new_server_user']) || !empty($_POST['new_server_user'])) && (!isset($_POST['new_server_port']) || !empty($_POST['new_server_port'])) && (!isset($_POST['user_id']) || !empty($_POST['user_id']))) {

            header("Content-type:application/json");

            $host = empty($_POST['new_server_host']) ? 'localhost' : $_POST['new_server_host'];
            $user = empty($_POST['new_server_user']) ? 'root' : $_POST['new_server_user'];
            $pass = empty($_POST['new_server_pass']) ? '' : $_POST['new_server_pass'];
            $port = empty($_POST['new_server_port']) ? 3306 : $_POST['new_server_port'];
            $ip = $_SERVER['REMOTE_ADDR'];
            $token = encrypt($ip . '_' . $host . '_' . $user . '_' . $pass . '_' . $port);
            $user_id = $_POST['user_id'];

            $DB->insert("INSERT INTO host (token, ip, host, user, password, port, arr_databases, active, visible, user_id) VALUES ('$token', '$ip', '$host', '$user', '$pass', '$port', '[]', true, 'yes', $user_id);");

            header('Content-type:application/json');
            header("HTTP/1.1 200 OK");
            return json_encode(['success' => true, 'error' => 0, 'output' => $DB->get_conections("SELECT * FROM host WHERE user_id = $user_id")]);

        } else {
            header("HTTP/1.1 400 Bad Request");
            header('Content-type:application/json');
            return json_encode(['success' => false, 'error' => 2, 'output' => 'Faltan parametros']);
        }
    }

    public function connect()
    {

        if (!empty($_POST)) {
            $host = $_POST['server'];

            $values = decrypt($host);

            $server = explode("_", $values);

            $_SESSION['server'] = $server;

            // Ejemplo de uso:
            $DB = new ConnectionPool('mysql:host='. $server[1] .';', $server[2],  $server[3]);

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

            $DB = new ConnectionPool('mysql:host='. $server[1] .';', $server[2],  $server[3]);

            //$enlace = null;
            if ($DB->status) {

//                $array_tables = [];
//
//                foreach ($DB->show_tables($_POST['mariaDB']) as $table) {
//                    array_push($array_tables, $table->table);
//                }

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

            $DB = new ConnectionPool('mysql:host='. $server[1] .';', $server[2],  $server[3]);

            //$enlace = null;
            if ($DB->status) {

//                $array_tables = [];
//
//                foreach ($DB->show_tables($_POST['mariaDB']) as $table) {
//                    array_push($array_tables, $table->table);
//                }

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

            $DB = new ConnectionPool('mysql:host='. $server[1] .';dbname=' . $dbname, $server[2],  $server[3]);

            if ($DB->status) {


                $tables = $DB->get_records($_POST['value']);

                header("HTTP/1.1 200 OK");
                return json_encode(['success' => true, 'error' => 0, 'output' => ['table' => $_POST['table'], 'rows' => $tables]]);
            } else {
                header("HTTP/1.1 400 Bad Request");
                return json_encode(['success' => false, 'error' => 6, 'output' => $DB->error]);
            }
        }
    }
}