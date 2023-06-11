<?php

require_once(__DIR__ . './../lib/MariaDB.php');

session_start();

unset($CFG, $DB);

global $CFG, $DB;

$CFG = new stdClass();
$CFG->wwwroot = '/SQL_Panel/api';

$DB = new MariaDB('localhost', 'root', '', '33306');