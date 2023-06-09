<?php

require_once(__DIR__. '/src/LoginAPI.php');
require_once(__DIR__. '/src/API.php');
include_once __DIR__ . '/lib/MariaDB.php';

global $CFG;

// Retornar la ruta correspondiente al controlador o función
function getRoute($url) {

    global $CFG;

    $LoginAPI = new LoginAPI();
    $API = new API();

    switch($url){
        case $CFG->wwwroot . '/login':
            echo $LoginAPI->check_user_login();
            break;
        case $CFG->wwwroot . '/register':
            echo $LoginAPI->create_user();
            break;
        case $CFG->wwwroot . '/edit_user':
            echo $LoginAPI->edit_user();
            break;
        case $CFG->wwwroot . '/get_servers':
            echo $API->get_servers();
            break;
        case $CFG->wwwroot . '/add_server':
            echo $API->add_server();
            break;
        case $CFG->wwwroot . '/edit_servers':
            echo $API->edit_servers();
            break;
        default:
            header("HTTP/1.1 405 Service Not Found");
            echo json_encode(['success' => false, 'error' => 1, 'output' => 'Servicio No Encontrado']);
    }

    $_SESSION['url'] = $url;
}