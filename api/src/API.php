<?php
require_once(__DIR__ . '/../lib/functions.php');
require_once(__DIR__ . '/../lib/ConnectionPool.php');

header('Content-Type: application/json');

class API
{

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

                try {

                    $tables = $DB->get_records($_POST['value']);
                    header("HTTP/1.1 200   Bad Request");
                    if($this->query_is_action($_POST['value'])){
                        return json_encode(['success' => true, 'error' => 0, 'message' => 'Accion completada correctamente']);
                    } else {
                        return json_encode(['success' => true, 'error' => 0, 'output' => ['table' => $_POST['table'], 'rows' => $tables]]);
                    }
                } catch (PDOException $e) {
                    return json_encode(['success' => false, 'error' => $e->getCode(), 'message' => explode('SQLSTATE[' .$e->getCode() .']: ', $e->getMessage())[1]]);
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

            $DB = new ConnectionPool('mysql:host='. $server[1] .';dbname=' . $dbname, $server[2],  $server[3]);

            if ($DB->status) {

                try {
                    $tables = $DB->delete_rows($_POST['table'] ,$_POST['value']);
                    header("HTTP/1.1 200 OK");
                    return json_encode(['success' => true, 'error' => 0, 'output' => ['table' => $_POST['table'], 'rows' => $tables]]);
                } catch (PDOException $e) {
                    header("HTTP/1.1 400 Bad Request");
                    return json_encode(['success' => false, 'error' => $e->getCode(), 'message' => explode('SQLSTATE[' .$e->getCode() .']: ', $e->getMessage())[1]]);
                }

            } else {
                header("HTTP/1.1 400 Bad Request");
                return json_encode(['success' => false, 'error' => 6, 'output' => $DB->error]);
            }
        }
    }

    public function query_is_action($query) {
        $lowercaseQuery = strtolower($query);

        // Patrón de expresión regular para buscar cualquier acción distinta a SELECT
        $pattern = '/\b(insert\s+into|update|delete\s+from|replace\s+into|truncate\s+table|create\s+table|use|drop\s+table|create\s+database|drop\s+database)\b/i';

        // Verificar si la consulta coincide con el patrón
        if (preg_match($pattern, $lowercaseQuery)) {
            return true;
        }

        // Si no se encontró ninguna acción, se considera una consulta SELECT
        return false;
    }

}