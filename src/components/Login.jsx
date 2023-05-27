import React, {useContext, useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import userLogin from "../helpers/userLogin.js";
import userRegister from "../helpers/userRegister.js";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUserContext } from "../contexts/PanelContext.jsx";
import { useNavigate } from 'react-router-dom';

//TODO: TERMINAR REGISTER
function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [userUpdated, setUserUpdated] = useState(false);
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const navigate = useNavigate();

    //Contexto del usuario
    let {user, setUser} = useUserContext().userContext;

    document.body.classList.add('bg-gradient');

    const submit = (data) => {

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        if(isLogin){
            userLogin(data)
                .then(result => {
                    if (typeof result !== 'undefined' && result.success) {
                        updateUserAndNavigate(result.output);
                    } else if (result.error === 4) {

                        Toast.fire({
                            icon: 'error',
                            title: result.output
                        })

                        setError('password', {
                            type: 'invalid',
                            message: result.output
                        });
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Server Error',
                            text: 'Error al conectar',
                            showConfirmButton: false,
                            showCancelButton: true,
                            cancelButtonText: 'Cerrar',
                        })
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            userRegister(data)
                .then(result => {
                    if (typeof result !== 'undefined' && result.success) {
                        console.log(result);
                    } else if (result.error === 3) {

                        Toast.fire({
                            icon: 'error',
                            title: result.output
                        })

                        setError('username', {
                            type: 'usertaken',
                        });
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Server Error',
                            text: 'Error al conectar',
                            showConfirmButton: false,
                            showCancelButton: true,
                            cancelButtonText: 'Cerrar',
                        })
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };


    const handleChangeMethod = () => {
        setIsLogin(!isLogin); // Invierte el valor booleano
    };

    //Actualizamos el usuario y el estado se actualizacion de usuario
    const updateUserAndNavigate = (newUserData) => {
        setUser(newUserData);
        setUserUpdated(true);
    };

    useEffect(() => {
        if (userUpdated) {
            navigate("/");
        }
    }, [userUpdated, navigate]);

    return (
        <div className="w-100 h-100 m-0">
            <div className="login-container">
                <div className={`login-form ${isLogin ? 'login-form-login' : 'login-form-register'}`}>
                    <div className="text">{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</div>
                    <form onSubmit={handleSubmit(submit)}>
                        <div className="field mb-2">
                            <div className="fas fa-duotone fa-user-secret text-success"></div>
                            <input type="text" placeholder="Usuario" {...register("username", {required: true})} />
                        </div>
                        {errors.username?.type === "required" && <span className="text-danger">Debe rellenar el campo</span>}
                        {errors.username?.type === "usertaken" && <span className="text-danger">Este usuario ya existe</span>}
                        <div className="field mb-2">
                            <div className="fas fa-lock text-success"></div>
                            <input type="password" placeholder="Contraseña" {...register("password", {required: true})} />
                        </div>
                        {errors.password?.type === "required" && <span className="text-danger">Debe rellenar el campo</span>}
                        {errors.password?.type === "invalid" && <span className="text-danger"> {errors.password?.message} </span>}
                        <button>Acceder</button>
                        <div className="link">
                            ¿Eres nuevo?
                            <a href="#" onClick={handleChangeMethod}>
                                {isLogin ? ' Regístrate' : ' Iniciar Sesión'}
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;