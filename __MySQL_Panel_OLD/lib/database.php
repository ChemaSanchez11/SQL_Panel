<?php
require_once __DIR__ . '/../config.php';

class database
{

    private $db;

    public function __construct($host = '', $user = '', $pass = '', $port = '')
    {
        global $CFG;
        if(empty($host) && empty($user) && empty($pass) &&empty($dbname)){
            $this->db = mysqli_connect($CFG->dbhost, $CFG->dbuser, $CFG->dbpass, $CFG->dbname);
        }else{
            $this->db = @mysqli_connect($host.':'.$port, $user, $pass);
        }

        return $this->db;

    }

    public function get_databases()
    {
        //return array_column($this->db->query('SHOW TABLES')->fetch_all(),0);;
        $result = mysqli_query($this->db, "SELECT TABLE_SCHEMA FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' GROUP BY TABLE_SCHEMA");
        //$result = mysqli_query($this->db, "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA LIKE '$database';");
        $std = new stdClass();

        for ($i = 1; $row = $result->fetch_assoc(); $i++) {
            $newobj = new stdClass();
            //foreach ($row as $object) {
                $newobj->database = $row["TABLE_SCHEMA"];
//                $newobj->table_type = $row["TABLE_TYPE"];
//                $newobj->table = $row["TABLE_NAME"];
//                $newobj->rows = $row["TABLE_ROWS"];
//                $newobj->size = $row["DATA_LENGTH"];
//                $newobj->increment = $row["AUTO_INCREMENT"];
//                $newobj->comment = $row["TABLE_COMMENT"];
//                $newobj->engine = $row["ENGINE"];
//                $newobj->collation = $row["TABLE_COLLATION"];
            //}
            $std->$i = $newobj;
        }

        return $std;
    }

    public function show_tables($database)
    {
        //return array_column($this->db->query('SHOW TABLES')->fetch_all(),0);;
        $result = mysqli_query($this->db, "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA ='$database'");
        //$result = mysqli_query($this->db, "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA LIKE '$database';");
        $std = new stdClass();

        for ($i = 1; $row = $result->fetch_assoc(); $i++) {
            $newobj = new stdClass();
            //foreach ($row as $object) {
            $newobj->database = $row["TABLE_SCHEMA"];
            $newobj->table_type = $row["TABLE_TYPE"];
            $newobj->table = $row["TABLE_NAME"];
            $newobj->rows = $row["TABLE_ROWS"];
            $newobj->size = $row["DATA_LENGTH"];
            $newobj->increment = $row["AUTO_INCREMENT"];
            $newobj->comment = $row["TABLE_COMMENT"];
            $newobj->engine = $row["ENGINE"];
            $newobj->collation = $row["TABLE_COLLATION"];
            //}
            $std->$i = $newobj;
        }

        return $std;
    }

    public function get_records($query)
    {

        $DB = $this->db;

        $result = $DB->query($query);
        if (!empty(mysqli_error($DB))) {
            echo '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css">';
            echo '<div class="container" style="display: flex; justify-content: center; align-items: center; height: 100vh">
                <div class="alert alert-danger" role="alert"> ' . mysqli_error($DB) . ' </div>
              </div>';
            die();
        } else if (!empty($result)) {
            $std = new stdClass();

            for ($i = 1; $row = $result->fetch_assoc(); $i++) {
                $newobj = new stdClass();
                foreach ($row as $key => $object) {
                    $newobj->$key = $row["$key"];
                }
                $std->$i = $newobj;
            }

            return $std;
        }
    }

    public function get_record($query)
    {
        $DB = $this->db;

        $result = $DB->query($query);
        if (!empty(mysqli_error($DB))) {
            echo '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css">';
            echo '<div class="container" style="display: flex; justify-content: center; align-items: center; height: 100vh">
                <div class="alert alert-danger" role="alert"> ' . mysqli_error($DB) . ' </div>
              </div>';
            die();
        } else if (!empty($result)) {
            $std = new stdClass();

            if ($result->num_rows == 1 && $result->num_rows != 0) {

                $row = $result->fetch_assoc();
                foreach ($row as $key => $object) {
                    $std->$key = $row["$key"];
                }
            } else if($result->num_rows != 0) {
                echo '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css">';
                echo '<div class="container" style="display: flex; justify-content: center; align-items: center; height: 100vh">
                <div class="alert alert-danger" role="alert"> Retorno mas de un resultado, debe utilizar get_records </div>
              </div>';
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
            echo '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css">';
            echo '<div class="container" style="display: flex; justify-content: center; align-items: center; height: 100vh">
                <div class="alert alert-danger" role="alert"> ' . mysqli_error($DB) . ' </div>
              </div>';
            die();
        } else {
            return $DB->insert_id;
        }
    }

    public function get_rows($table)
    {

        $DB = $this->db;

        $result = mysqli_query($DB, "SELECT count(*) as t_rows FROM $table");
        $row = $result->fetch_assoc();
        return $row['t_rows'];

    }
}