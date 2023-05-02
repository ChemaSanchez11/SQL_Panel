import React, {useEffect, useState} from "react";
import ReactDOM from 'react-dom/client';
import {router} from "./routes/index.jsx";
import {RouterProvider} from "react-router-dom";
import {ContextUserProvider} from "./contexts/UserContext.jsx";

//TODO: Pasar de componentes a paginas

ReactDOM.createRoot(document.getElementById('root')).render(
    <ContextUserProvider>
        <RouterProvider router={router} />
    </ContextUserProvider>,
)