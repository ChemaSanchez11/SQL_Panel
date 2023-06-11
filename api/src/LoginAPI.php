<?php
require_once(__DIR__ . '/../lib/functions.php');

header('Content-Type: application/json');
class LoginAPI
{

    /**
     * Logear usuario
     *
     * @return string JSON con los datos del usuario.
     */
    public function check_user_login()
    {

        global $DB;

        if (!empty($_POST) && (!isset($_POST['username']) || !empty($_POST['username'])) && (!isset($_POST['password']) || !empty($_POST['password']))) {

            $username = $_POST['username'];

            $user = $DB->get_record("SELECT * FROM user WHERE username = '$username' AND visible = 1");

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

    /**
     * Registrar usuario
     *
     * @return string JSON con los datos del usuario.
     */
    public function create_user()
    {

        global $DB;

        if (!empty($_POST) && (!isset($_POST['username']) || !empty($_POST['username'])) && (!isset($_POST['password']) || !empty($_POST['password']))) {

            //Comprobamos que ese usuario no exista
            $username = $_POST['username'];
            $user = $DB->get_record("SELECT * FROM user WHERE username = '$username'");

            if(!empty($user)){
                header("HTTP/1.1 200 OK");
                return json_encode(['success' => false, 'error' => 3, 'output' => 'Este usuario ya existe']);
            }

            $new_user = $DB->insert("INSERT INTO `user` (username, password, photo, rol, visible) VALUES ('". $_POST['username'] ."', '". $_POST['password'] ."', 'default.png', '[\"user\"]', 1);");

            header("HTTP/1.1 200 OK");
            if($new_user['success']){ //Si se ha podido registrar devolvemos el usuario
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
    /**
     * Editar usuario
     *
     * @return string JSON con el resultado de la accion.
     */
    public function edit_user()
    {
        global $DB;

        header('Content-type:application/json');

        if (!empty($_POST)) {
            if($_POST['type'] === 'update'){
                $id = $_POST['id'];
                $username = $_POST['user_username'];
                $password = $_POST['user_new_password'];

                $query ='UPDATE user SET username = ?, password = ? WHERE id = ?;';
                $params = [$username, $password, $id];
                $result = $DB->execute($query, $params);
                if($result){
                    header("HTTP/1.1 200 OK");
                    return json_encode(['success' => true, 'error' => 0, 'output' => $DB->get_conections("SELECT * FROM user WHERE id = $id")]);
                } else {
                    header("HTTP/1.1 400 Bad Request");
                    return json_encode(['success' => false, 'error' => 2, 'output' => 'Error al preparar la query']);
                }
            } else if($_POST['type'] === 'delete') { // Si la accion es eliminar ponemos visible a 0
                $id = $_POST['id'];

                $query = 'UPDATE user SET visible = 0 WHERE id = ?';
                $params = [$id];
                $result = $DB->execute($query, $params);

                if($result){
                    header("HTTP/1.1 200 OK");
                    return json_encode(['success' => true, 'error' => 0]);
                } else {
                    header("HTTP/1.1 400 Bad Request");
                    return json_encode(['success' => false, 'error' => 2, 'output' => 'Error al preparar la query']);
                }
            }

        } else {
            header("HTTP/1.1 400 Bad Request");
            return json_encode(['success' => false, 'error' => 2, 'output' => 'Faltan parametros']);
        }
    }
}