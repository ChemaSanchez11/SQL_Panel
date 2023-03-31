<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../encrypt.php';

global $CFG, $DB, $CLIENT, $database;


if (!empty($_POST && $_POST['action'] === 'new_server')) {

    header("Content-type:application/json");

    if (empty($_POST['user_mac'])) {
        header("HTTP/1.1 400 Bad Request");
        header('Content-type:application/json');
        $msg['status'] = "400";
        $msg['success'] = false;
        $msg['error'] = 'No ha sido posible registrar la MAC del equipo';
        die(json_encode($msg));
    }

    $id_host = $CLIENT->id;

    $host = !empty($_POST['new_server_host']) ? $_POST['new_server_host'] : 'localhost';
    $user = !empty($_POST['new_server_user']) ? $_POST['new_server_user'] : 'root';
    $pass = !empty($_POST['new_server_pass']) ? $_POST['new_server_pass'] : '';
    $port = !empty($_POST['new_server_port']) ? $_POST['new_server_port'] : 3306;
    $mac = $_POST['user_mac'];
    $token = encrypt($mac . '_' . $host . '_' . $user . '_' . $pass . '_' . $port);

    $json = file_get_contents('./../../db/hosts.json');
    $json = json_decode($json);
    $id = 1;
    if (!empty($json)) {
        foreach ($json as $data) {
            $id = $data->id + 1;
        }
    }

    $host = array(
        "id" => $id,
        "token" => "$token",
        "mac" => "$mac",
        "host" => "$host",
        "user" => "$user",
        "password" => "$pass",
        "port" => $port,
        "active" => "yes"
    );

    $myfile = fopen('./../../db/hosts.json', "w") or die("Error 405!");

    if (!empty($json)) array_push($json, $host);
    else $json = [$host];


    fwrite($myfile, json_encode($json, JSON_PRETTY_PRINT));
    fclose($myfile);


    //$DB->insert("INSERT INTO connections VALUES(null, '$id_host', '$token', '$mac', '$host', '$user', '$pass', $port)");
    header("HTTP/1.1 200 OK");
    header('Content-type:application/json');
    $msg['status'] = "200";
    $msg['success'] = true;
    die(json_encode($msg));
}

if (!empty($_POST && $_POST['action'] === 'show_tables')) {
    $dbase = $_POST['database'];
    $html = "<table id='table_databases' data-base='' class='table table-striped table-dark mt-2' style='width:100%'>
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Columnas</th>
                    <th>Tamaño</th>
                    <th>Comentario</th>
                    <th>Motor</th>
                    <th>Collation</th>
                </tr>
                </thead>
                <tbody>";
    foreach ($database->show_tables($dbase) as $table) {
        $rows = $database->get_rows("$table->database.$table->table");
        $html .= "<tr>
                      <td>$table->table</td>
                      <td>$rows</td>
                      <td>$table->size</td>
                      <td>$table->comment</td>
                      <td>$table->engine</td>
                      <td>$table->collation</td>
                  </tr>";
    }

    $html .= "</tfoot></table>";
    echo $html;
}

if (!empty($_POST && $_POST['action'] === 'show_menu')) {
    $dbases = $_POST['database'];
    $server_id = $_POST['server_id'];
    $html = '';
    foreach ($dbases as $dbase){
        $html .= "<p onclick='javascript:click_on_database(this)' ondblclick='javascript:dropdown_tables(this)' data-server='". $server_id ."' data-database='". $dbase ."'  class='m-0 pl-5 pb-1 database'><img src='img/icons/148825.png' width='20' height='22' class='mr-2'><a>". $dbase ."</a></p>";
        $html .= "<br> <p class='table_$dbase mb-1 row d-none' style='padding-left: 4.5rem !important;'>";
        foreach ($database->show_tables($dbase) as $table) {
            $html .= "<span class='col-12'><img src='img/icons/table.png' width='20' height='22' class='mr-2'><a>$table->table</a></span>";
        }
        $html .= "</p>";
    }
    echo $html;
}


