import React, { useContext } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Error from '../components/Error.jsx';
import Home from '../components/Home.jsx';
import Login from '../components/Login.jsx';
import { UserContext } from '../contexts/UserContext.jsx';

const PrivateRoute = ({ children }) => {
    const { user, setUser } = useContext(UserContext); // Usa el hook useContext para acceder al contexto

    // Utiliza el valor de user del contexto para determinar si el usuario ha iniciado sesión o no
    return user !== false ? children : <Navigate to="/login" />; // Redirige a "/login" si no ha iniciado sesión
};

export const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: (
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                ), // Utiliza el componente PrivateRoute para proteger la ruta de inicio ("/")
            },
        ],
    },
    {
        path: '/login',
        element: <Login />,
    },
]);