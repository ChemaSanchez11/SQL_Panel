import React, {useEffect, useState} from "react";
import ReactDOM from 'react-dom/client';
import {router} from "./routes/index.jsx";
import {RouterProvider} from "react-router-dom";
import {ContextPanelProvider} from "./contexts/PanelContext.jsx";

//TODO: Pasar de componentes a paginas

ReactDOM.createRoot(document.getElementById('root')).render(
    <ContextPanelProvider>
        <RouterProvider router={router} />
    </ContextPanelProvider>,
)