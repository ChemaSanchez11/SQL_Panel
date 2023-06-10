<?php

//Se utiliza la clase MariaDB para las conexiones internas del servidor, tema de usuarios y conexiones..
class MariaDB
{

    public $status = false;
    public $error;
    private $db;

    public function __construct($host = '', $user = '', $pass = '', $port = '')
    {

        if(empty($this->db)){
            $this->db = @mysqli_connect($host.':'.$port, $user, $pass, 'sql_panel');
            $_SESSION['db'] = $this->db;
        }

        if($this->db) $this->status = true;
        else $this->error = mysqli_connect_error();

        return $this->db;
    }

    public function get_conections($query)
    {

        $DB = $this->db;

        $result = $DB->query($query);
        if (!empty(mysqli_error($DB))) {
            return [];
        } else if (!empty($result)) {

            $hosts = [];
            for ($i = 1; $row = $result->fetch_assoc(); $i++) {
                $newobj = new stdClass();
                foreach ($row as $key => $object) {
                    $newobj->$key = $row["$key"];
                }
                $newobj->arr_databases = [];
                $hosts[] = $newobj;
            }

            return $hosts;
        }
    }

    public function get_record($query)
    {
        $DB = $this->db;

        $result = $DB->query($query);
        if (!empty($result)) {
            $std = new stdClass();

            if ($result->num_rows == 1 && $result->num_rows != 0) {

                $row = $result->fetch_assoc();
                foreach ($row as $key => $object) {
                    $std->$key = $row["$key"];
                }
            }else if($result->num_rows == 0){
                $std = null;
            }
            return $std;
        }
    }

    public function insert($query)
    {
        $DB = $this->db;
        $result = mysqli_query($DB, $query);
        if (!empty(mysqli_error($DB))) {
            return ['success' => false, 'output' => mysqli_error($DB)];
        } else {
            return ['success' => true, 'output' => $DB->insert_id];
        }
    }

    public function execute($query){
        $DB = $this->db;

        return mysqli_query($DB, $query);
    }
}