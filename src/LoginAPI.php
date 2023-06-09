<?php
require_once(__DIR__ . '/../lib/functions.php');

header('Content-Type: application/json');
class LoginAPI
{

    public function check_user_login()
    {

        global $DB;

        if (!empty($_POST) && (!isset($_POST['username']) || !empty($_POST['username'])) && (!isset($_POST['password']) || !empty($_POST['password']))) {

            $username = $_POST['username'];

            $user = $DB->get_record("SELECT * FROM user WHERE username = '$username'");

            $user_login = null;
            if(!empty($user)){
                if($user->password === $_POST['password']){
                    $user_login = $user;
                }
                else $error = 'Contraseña incorrecta';
            } else $error = 'Usuario no válido';

            header("HTTP/1.1 200 OK");
            if(empty($user_login) && !empty($error)){
                return json_encode(['success' => false, 'error' => 4, 'output' => $error]);
            }
            return json_encode(['success' => true, 'error' => 0, 'output' => $user_login]);

        } else {
            header("HTTP/1.1 400 Bad Request");
            return json_encode(['success' => false, 'error' => 2, 'output' => 'Faltan parametros']);
        }
    }

    public function create_user()
    {

        global $DB;

        if (!empty($_POST) && (!isset($_POST['username']) || !empty($_POST['username'])) && (!isset($_POST['password']) || !empty($_POST['password']))) {

            $username = $_POST['username'];
            $user = $DB->get_record("SELECT * FROM user WHERE username = '$username'");

            if(!empty($user)){
                header("HTTP/1.1 200 OK");
                return json_encode(['success' => false, 'error' => 3, 'output' => 'Este usuario ya existe']);
            }

            $new_user = $DB->insert("INSERT INTO `user` (username, password, photo, rol, visible) VALUES ('". $_POST['username'] ."', '". $_POST['password'] ."', 'default.png', '[\"user\"]', 1);");

            header("HTTP/1.1 200 OK");
            if($new_user['success']){
                $user = $DB->get_record("SELECT * FROM user WHERE id = " . $new_user['output']);
                return json_encode(['success' => true, 'error' => 0, 'output' => $user]);
            } else {
                return json_encode(['success' => false, 'error' => 5, 'output' => $new_user['output']]);
            }
        } else {
            header("HTTP/1.1 400 Bad Request");
            return json_encode(['success' => false, 'error' => 2, 'output' => 'Faltan parametros']);
        }
    }

    public function edit_user()
    {
        global $DB;

        if (!empty($_POST)) {
            $id = $_POST['id'];
            $username = $_POST['user_username'];
            $password = $_POST['user_new_password'];

            $DB->execute("UPDATE user SET username = '$username', password = '$password' WHERE id = $id;");

            header('Content-type:application/json');
            header("HTTP/1.1 200 OK");
            return json_encode(['success' => true, 'error' => 0, 'output' => $DB->get_conections("SELECT * FROM user WHERE id = $id")]);
        } else {
            header("HTTP/1.1 400 Bad Request");
            header('Content-type:application/json');
            return json_encode(['success' => false, 'error' => 2, 'output' => 'Faltan parametros']);
        }
    }
}