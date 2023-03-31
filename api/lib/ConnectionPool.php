<?php

/*
 PDO utiliza un sistema de caché de conexiones para optimizar el rendimiento y evitar la sobrecarga del servidor de bases de datos.
 Cuando se establece una conexión, esta conexión se guarda en un "pool" de conexiones y se reutiliza para futuras solicitudes de conexión.
 Esto evita la sobrecarga en el servidor de la base de datos, ya que no es necesario crear y cerrar una conexión nueva cada vez que se realiza una solicitud.
*/

class ConnectionPool
{
    private $db;
    public $status;
    public $error;

    public function __construct($dsn, $user, $password, $maxConnections = 5)
    {
        try {
            $this->db = new PDO($dsn, $user, $password, [PDO::ATTR_PERSISTENT => true]);
            $this->status = true;
        } catch (PDOException $e) {
            $this->error = 'Error de conexión: ' . $e->errorInfo[2];
            $this->status = false;
        }
    }

    public function get_connection()
    {
        return (Object) ['status' => $this->status, 'error' => $this->error];
    }

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

    public function show_tables($database)
    {

        $PDO = $this->db;
        $result = $PDO->prepare("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA ='$database'");
        $result->execute();
        $std = [];

        while ($row = $result->fetch()) {
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
            $std[] = $newobj;
        }

        return (Object) $std;
    }
}