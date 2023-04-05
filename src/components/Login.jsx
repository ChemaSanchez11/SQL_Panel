import server_connection from '/icons/server_connection.png';
import database_reload from '/icons/database_reload.png';
import query from '/icons/query.png';
import warning from '/icons/warning.png';
import done from '/icons/done.png';
import error from '/icons/error.png';
import info from '/icons/info.png';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login({status}) {

    document.body.classList.add('bg-gradient');
    // document.querySelector('html').classList.add('bg-gradient');

    return (
        <div className="w-100 h-100 m-0">
            <div className="login-container">
                <div className="login-form">
                    <div className="text">
                        Iniciar Sesion
                    </div>
                    <form>
                        <div className="field">
                            <div className="fas fa-duotone fa-user-secret text-success"></div>
                            <input type="text" placeholder="Usuario" />
                        </div>
                        <div className="field">
                            <div className="fas fa-lock text-success"></div>
                            <input type="password" placeholder="Contraseña" />
                        </div>
                        <button>Acceder</button>
                        <div className="link">
                            ¿Eres nuevo?
                            <a href="#"> Registrate</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;
