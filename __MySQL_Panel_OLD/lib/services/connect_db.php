<?php

require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../encrypt.php';

global $CFG, $DB, $database;

if(!empty($_POST && $_POST['action'] === 'connect_db')){
    $host = $_POST['server'];

    $values = decrypt($host);

    $info = explode("_", $values);

    $link = @mysqli_connect($info[1].':'.$info[4], $info[2], $info[3]);

    //$enlace = null;
    if($link)
    {
        $_SESSION['server'] = $info;
        $array_databases = [];
        $database = new database($info[1].':'.$info[4], $info[2], $info[3]);

        foreach($database->get_databases() as $databases){
            array_push($array_databases, $databases->database);
        }

        header("HTTP/1.1 200 OK");
        header('Content-type:application/json');
        $msg['status']="200";
        $msg['success']=true;
        $msg['text']=$array_databases;
        echo json_encode($msg);
    } else {
        header("HTTP/1.1 400 Bad Request");
        header('Content-type:application/json');
        $msg['status']="400";
        $msg['success']=false;
        $msg['error']= mysqli_connect_error();
        die(json_encode($msg));
    }
}

