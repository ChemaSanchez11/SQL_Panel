//Importamos create context que permite crear el contexto
import {createContext, useContext, useState} from "react";

export const PanelContext = createContext();

//Creamos el provider que permite envolver a los componentes que les quiero mandr el contexto
export function ContextPanelProvider(props) {
    //Ponemos lo que queremos que se vean en los componentes

    let user_cached = sessionStorage.getItem('user');
    if (user_cached) {
        user_cached = JSON.parse(user_cached);
    } else {
        user_cached = false;
    }

    const [user, setUser] = useState(user_cached);
    const [current, setCurrent] = useState({});
    const [reload, setReload] = useState(Date.now());
    const [servers, setServers] = useState([]);
    const value = {
        userContext: {user, setUser},
        currentContext: {current, setCurrent},
        reloadContext: {reload, setReload},
        serversContext: {servers, setServers}
    };
    //Exportamos un componente de tipo Provider
    return <PanelContext.Provider value={value}>{props.children}</PanelContext.Provider>;
}

//Debemos exportar el contexto y el provider

//Hook personalizado
export function usePanelContext() {
    return useContext(PanelContext);
}