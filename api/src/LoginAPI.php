<?php
require_once(__DIR__ . '/../lib/functions.php');

header('Content-Type: application/json');
class LoginAPI
{

    public function get_user_by_username()
    {
        if (!empty($_POST) && (!isset($_POST['username']) || !empty($_POST['username'])) && (!isset($_POST['password']) || !empty($_POST['password']))) {

            $users = json_decode(@file_get_contents(__DIR__ . '/../json/users.json'));

            $user_login = null;
            $error = null;

            if (empty($users)) {
                $users = [];
                //Añadimos al archivo
                $db = fopen(__DIR__ . '/../json/users.json', "w") or die("Error 405!");
                fwrite($db, json_encode($users, JSON_PRETTY_PRINT));
                fclose($db);
            } else {

                foreach ($users as $user){
                    if($user->username === $_POST['username']){
                        if($user->password === $_POST['password']) $user_login = $user;
                        else $error = 'Contraseña incorrecta';
                    } else $error = 'Usuario no valido';
                }
            }

            header("HTTP/1.1 200 OK");
            if(empty($user_login) && !empty($error)){
                return json_encode(['success' => false, 'error' => 4, 'output' => $error]);
            }
            return json_encode(['success' => true, 'error' => 0, 'output' => $users]);

        } else {
            header("HTTP/1.1 400 Bad Request");
            return json_encode(['success' => false, 'error' => 2, 'output' => 'Faltan parametros']);
        }
    }

    public function create_user()
    {

        if (!empty($_POST) && (!isset($_POST['username']) || !empty($_POST['username'])) && (!isset($_POST['password']) || !empty($_POST['password']))) {

            header("Content-type:application/json");

            $ip = $_SERVER['REMOTE_ADDR'];
            $json = @file_get_contents(__DIR__ . '/../json/users.json');
            $users = json_decode($json);

            foreach ($users as $user){
                if($user->username=== $_POST['username']){
                    header("HTTP/1.1 200 OK");
                    return json_encode(['success' => false, 'error' => 3, 'output' => 'Este usuario ya existe']);
                }
            }

            $id = 0;
            if (!empty($users)) {
                $id = end($users)->id;
            }

            $id++;

            $user = array(
                "id" => $id,
                "username" => $_POST['username'],
                "password" => $_POST['password'],
                "rol" => ['user'],
                "ip" => $ip,
                "visible" => "yes"
            );

            !empty($users) ? array_push($users, $user) : $json = [$user];

            $db = fopen(__DIR__ . '/../json/users.json', "w") or die("Error 405!");

            fwrite($db, json_encode($users, JSON_PRETTY_PRINT));
            fclose($db);

            header("HTTP/1.1 200 OK");
            return json_encode(['success' => true, 'error' => 0, 'output' => $user]);

        } else {
            header("HTTP/1.1 400 Bad Request");
            return json_encode(['success' => false, 'error' => 2, 'output' => 'Faltan parametros']);
        }
    }
}