<?php

//Se utiliza la clase MariaDB para las conexiones internas del servidor, tema de usuarios y conexiones..
class MariaDB
{

    public bool $status = false;
    public ?string $error;
    private $db;

    /**
     * @param $host
     * @param $user
     * @param $pass
     * @param $port
     */
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

    /**
     * Devuelve las conexiones de ese usuario
     * @param $query
     * @return array|void
     */
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

    /**
     * Obtener datos de una tabla en base a esa query
     * @param $query
     * @return stdClass|void|null
     */
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

    /**
     * Inserta datos en esa tabla
     * @param $query
     * @return array
     */
    public function insert($query): array
    {
        $DB = $this->db;
        $result = mysqli_query($DB, $query);
        if (!empty(mysqli_error($DB))) {
            return ['success' => false, 'output' => mysqli_error($DB)];
        } else {
            return ['success' => true, 'output' => $DB->insert_id];
        }
    }

    /**
     * Ejecutamos una query en las tablas internas
     * @param $query
     * @param $params
     * @return bool
     */
    public function execute($query, $params = []): bool
    {
        $DB = $this->db;

        // Creamos la sentencia preparada
        $statement = mysqli_prepare($DB, $query);

        if ($statement) {
            // Vinculamos los parámetros a la query
            if (!empty($params)) {

                //Para seleccionar el tipo de parametro que es
                $types = '';
                foreach ($params as $param) {
                    if (is_int($param)) {
                        $types .= 'i'; // Tipo entero (integer)
                    } elseif (is_float($param)) {
                        $types .= 'd'; // Tipo de punto flotante (double)
                    } elseif (is_null($param)) {
                        $types .= 's'; // Tipo NULL
                    } else {
                        $types .= 's'; // Tipo cadena (string) por defecto
                    }
                }

                // Agregar la cadena de definición de tipo como primer elemento en el arreglo de parámetros
                array_unshift($params, $types);

                mysqli_stmt_bind_param($statement, ...$params);
            }

            // Ejecutamos la sentencia preparada
            mysqli_stmt_execute($statement);
            return true;
        } else {
            // Si falla devolvemos false
            return false;
        }
    }
}