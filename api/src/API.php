<?php
require_once(__DIR__ . '/../lib/functions.php');
require_once(__DIR__ . '/../lib/database.php');
require_once(__DIR__ . '/../lib/ConnectionPool.php');

header('Content-Type: application/json');

class API
{


    public function get_servers()
    {
        $servers = @file_get_contents(__DIR__ . '/../hosts.json');

        if (empty($servers)) {
            $servers = [];
            //Añadimos al archivo
            $db = fopen(__DIR__ . '/../hosts.json', "w") or die("Error 405!");
            fwrite($db, json_encode($servers, JSON_PRETTY_PRINT));
            fclose($db);
        }

        header("HTTP/1.1 200 OK");
        return json_encode(['success' => true, 'error' => 0, 'output' => $servers]);
    }

    public function add_server()
    {

        if (!empty($_POST) && (!isset($_POST['new_server_host']) || !empty($_POST['new_server_host'])) && (!isset($_POST['new_server_user']) || !empty($_POST['new_server_user'])) && (!isset($_POST['new_server_port']) || !empty($_POST['new_server_port']))) {

            header("Content-type:application/json");

            $host = !empty($_POST['new_server_host']) ? $_POST['new_server_host'] : 'localhost';
            $user = !empty($_POST['new_server_user']) ? $_POST['new_server_user'] : 'root';
            $pass = !empty($_POST['new_server_pass']) ? $_POST['new_server_pass'] : '';
            $port = !empty($_POST['new_server_port']) ? $_POST['new_server_port'] : 3306;
            $ip = $_SERVER['REMOTE_ADDR'];
            $token = encrypt($ip . '_' . $host . '_' . $user . '_' . $pass . '_' . $port);

            $json = @file_get_contents(__DIR__ . '/../hosts.json');
            $json = json_decode($json);

            $id = 0;
            if (!empty($json)) {
                $id = end($json)->id;
            }

            $id++;

            $host = array(
                "id" => $id,
                "token" => "$token",
                "ip" => "$ip",
                "host" => "$host",
                "user" => "$user",
                "password" => "$pass",
                "port" => $port,
                "databases" => [],
                "active" => false,
                "visible" => "yes"
            );

            !empty($json) ? array_push($json, $host) : $json = [$host];

            $db = fopen(__DIR__ . '/../hosts.json', "w") or die("Error 405!");

            fwrite($db, json_encode($json, JSON_PRETTY_PRINT));
            fclose($db);

            header("HTTP/1.1 200 OK");
            header('Content-type:application/json');
            header("HTTP/1.1 200 OK");
            return json_encode(['success' => true, 'error' => 0, 'output' => $json]);

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
//                foreach ($DB->show_tables($_POST['database']) as $table) {
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
}