<?php

require_once(__DIR__. '/src/API.php');
include_once __DIR__ . '/lib/database.php';

global $CFG;

// Definir las rutas
$routes = array(
    $CFG->wwwroot . '/get_servers' => 'test',
    $CFG->wwwroot . '/add_server' => 'add_server.php',
    $CFG->wwwroot . '/connect' => 'connect.php',
    $CFG->wwwroot . '/get_tables' => 'get_tables.php',
);


// Retornar la ruta correspondiente al controlador o función
function getRoute($url) {

    global $CFG;

    $API = new API();

    switch($url){
        case $CFG->wwwroot . '/get_servers':
            echo $API->get_servers();
            break;
        case $CFG->wwwroot . '/add_server':
            echo $API->add_server();
            break;
        case $CFG->wwwroot . '/connect':
            echo $API->connect();
            break;
        case $CFG->wwwroot . '/get_tables':
            echo $API->get_tables();
            break;
        default:
            header("HTTP/1.1 405 Service Not Found");
            echo json_encode(['success' => false, 'error' => 1, 'output' => 'Servicio No Encontrado']);
    }

    $_SESSION['url'] = $url;
}