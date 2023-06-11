<?php

/*
 PDO utiliza un sistema de caché de conexiones para optimizar el rendimiento y evitar la sobrecarga del servidor de bases de datos.
 Cuando se establece una conexión, esta conexión se guarda en un "pool" de conexiones y se reutiliza para futuras solicitudes de conexión.
 Esto evita la sobrecarga en el servidor de la base de datos, ya que no es necesario crear y cerrar una conexión nueva cada vez que se realiza una solicitud.
*/

class ConnectionPool
{
    private PDO $db;
    public bool $status;
    public string $error;

    public function __construct($dsn, $user, $password, $maxConnections = 5)
    {
        try {
            $this->db = new PDO($dsn, $user, $password, [PDO::ATTR_PERSISTENT => true, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
            $this->status = true;
        } catch (PDOException $e) {
            $this->error = 'Error de conexión: ' . $e->errorInfo[2];
            $this->status = false;
        }
    }

    public function get_connection()
    {
        return (object)['status' => $this->status, 'error' => $this->error];
    }

    /**
     * Devuelve las databases de una conexion
     * @return array|false
     */
    public function get_databases()
    {

        // Obtener una conexión
        $PDO = $this->db;

        // Realizar consultas con la conexión obtenida
        $result = $PDO->prepare("SELECT TABLE_SCHEMA FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' GROUP BY TABLE_SCHEMA");
        $result->execute();

        //Convertir el resultado a una sola columna
        return $result->fetchAll(PDO::FETCH_COLUMN, 0);
    }

    /**
     * Devuelve las tablas de esa database
     * @param $database
     * @return object
     */
    public function show_tables($database): object
    {

        $PDO = $this->db;
        if($database === 'information_schema'){
            $result = $PDO->prepare("SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'information_schema';");
        } else {
            $result = $PDO->prepare("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA ='$database'");
        }
        $result->execute();
        $std = [];

        while ($row = $result->fetch()) {
            $newobj = new stdClass();
            $newobj->database = $row["TABLE_SCHEMA"];
            $newobj->table_type = $row["TABLE_TYPE"];
            $newobj->table = $row["TABLE_NAME"];
            $newobj->rows = $row["TABLE_ROWS"];
            $newobj->size = $row["DATA_LENGTH"];
            $newobj->increment = $row["AUTO_INCREMENT"];
            $newobj->comment = $row["TABLE_COMMENT"];
            $newobj->engine = $row["ENGINE"];
            $newobj->collation = $row["TABLE_COLLATION"];
            $std[] = $newobj;
        }

        return (object)$std;
    }

    /**
     * Devuelve datos de una tabla
     * @param $table
     * @param $database
     * @return object
     */
    public function get_rows($table, $database): object
    {

        $PDO = $this->db;
        $result = $PDO->prepare("SELECT * FROM `$database`.`$table`");
        $result->execute();
        $rows = [];

        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $rows[] = $row;
        }

        if (empty($rows)) {

            $result = $PDO->prepare("
                SELECT
                    COLUMN_NAME 
                FROM
                    `information_schema`.`COLUMNS` 
                WHERE
                    `TABLE_SCHEMA` = '$database' 
                    AND `TABLE_NAME` = '$table'");
            $result->execute();
            $rows = [];

            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                $field = $row['COLUMN_NAME'];
//                $rows[0] = [$field => null];
                $rows = array_merge($rows, [$field => null]);
            }

            return (object) [$rows];
        }

        return (object)$rows;
    }

    /**
     * Devuelve los resultados de la query
     * @param $query
     * @return object
     */
    public function get_records($query): object
    {


            $PDO = $this->db;
            $result = $PDO->prepare($query);
            $result->execute();
            $std = [];

            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                $newobj = new stdClass();
                foreach ($row as $key => $value) {
                    $newobj->{$key} = $value;
                }
                $std[] = $newobj;
            }

            return (object)$std;

    }

    /**
     * Elimina datos de esa tabla
     * @param $table
     * @param $query
     * @return bool
     */
    public function delete_rows($table, $query): bool
    {

        $data = json_decode($query);

        $where = 'WHERE ';
        foreach ($data as $key => $value) {

            if(empty($value)) continue;

            if ($where !== "WHERE ") {
                $where .= " AND ";
            }
            $where .= "$key = '" . $value . "'";
        }

        $PDO = $this->db;
        $result = $PDO->prepare("DELETE FROM $table $where");
        $result->execute();

        return true;
    }
}