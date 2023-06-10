<?php

require_once(__DIR__. '/src/API.php');
require_once(__DIR__. '/src/LoginAPI.php');

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
        case $CFG->wwwroot . '/connect':
            echo $API->connect();
            break;
        case $CFG->wwwroot . '/get_tables':
            echo $API->get_tables();
            break;
        case $CFG->wwwroot . '/get_rows':
            echo $API->get_rows();
            break;
        case $CFG->wwwroot . '/get_records':
            echo $API->get_records();
            break;
        case $CFG->wwwroot . '/delete_rows':
            echo $API->delete_rows();
            break;
        default:
            header("HTTP/1.1 405 Service Not Found");
            echo json_encode(['success' => false, 'error' => 1, 'output' => 'Servicio No Encontrado']);
    }

    $_SESSION['url'] = $url;
}