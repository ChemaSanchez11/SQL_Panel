<?php
require_once __DIR__ . '/lib/database.php';

session_start();

unset($CFG, $DB, $CLIENT, $database);

global $CFG, $DB, $CLIENT, $database;

$CFG = new stdClass();

if (is_session_started() && isset($_SESSION['server']) && !empty($_SESSION['server'])){
    $connect = $_SESSION['server'];
//    $CFG->dbhost = $connect[1];
//    $CFG->dbuser = $connect[2];
//    $CFG->dbpass = $connect[3];
//    $CFG->dbname = 'mysql_panel';
//    $CFG->port = $connect[4];
//    var_dump("INICIO");
    $database = new mariaDB($connect[1], $connect[2], $connect[3], $connect[4]);

}


$CFG->dbhost = 'localhost';
$CFG->dbuser = 'root';
$CFG->dbpass = '';
$CFG->dbname = 'mysql_panel';
$CFG->port = '3306';

$CFG->wwwroot = 'http://localhost/SQL_Panel/__MySQL_Panel_OLD';

$DB = new mariaDB();

$mac_addres = GetMAC();

$CLIENT = $DB->get_record("SELECT * FROM hosts WHERE mac = '$mac_addres'");

if(empty($CLIENT)){
    $DB->insert("INSERT INTO `hosts` VALUES (null, '$mac_addres');");
}

function GetMAC(){
    ob_start();
    system('getmac');
    $Content = ob_get_contents();
    ob_clean();
    return substr($Content, strpos($Content,'\\')-20, 17);
}

function is_session_started()
{
    if ( php_sapi_name() !== 'cli' ) {
        if ( version_compare(phpversion(), '5.4.0', '>=') ) {
            return session_status() === PHP_SESSION_ACTIVE ? TRUE : FALSE;
        } else {
            return session_id() === '' ? FALSE : TRUE;
        }
    }
    return FALSE;
}