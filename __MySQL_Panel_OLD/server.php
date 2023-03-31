<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/lib/encrypt.php';

global $DB, $database;
var_dump($database->show_tables());

$json = file_get_contents('./db/hosts.json');

$json = json_decode($json);


$value = array(
    "id"=> 2,
    "token" => "9091ynYAmCo3MAn5tiD/Gw",
    "mac"=> "2C-F0-5D-5A-4F-22",
    "host"=> "localhost",
    "user"=> "root",
    "password"=> "",
    "port"=> 3306,
    "active"=> "yes"
);

//$myfile = fopen('./db/hosts.json', "w") or die("Unable to open file!");
//
//if(!empty($json)) array_push($json, $value);
//else $json = [$value];


//fwrite($myfile, json_encode($json, JSON_PRETTY_PRINT));
//fclose($myfile);

$json = file_get_contents('./db/hosts.json');

$json = json_decode($json);

foreach ($json as $data){
    var_dump(decrypt($data->token));
}

