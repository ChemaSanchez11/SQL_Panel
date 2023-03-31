<?php

// Incluir el archivo de rutas
require_once(__DIR__ . '/config/config.php');
require_once (__DIR__ . '/routes.php');

// Obtener la URL actual
$url = explode('?', $_SERVER['REQUEST_URI'])[0];

// Obtener la ruta correspondiente
$route = getRoute($url);
