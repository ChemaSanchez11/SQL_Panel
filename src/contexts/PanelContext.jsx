//Importamos create context que permite crear el contexto
import {createContext, useContext, useState} from "react";

export const PanelContext = createContext();

//Creamos el provider que permite envolver a los componentes que les quiero mandr el contexto
export function ContextPanelProvider(props) {
    //Ponemos lo que queremos que se vean en los componentes
    const [user, setUser] = useState(false);
    const [current, setCurrent] = useState({});
    const value = {
        userContext: {user, setUser},
        currentContext: {current, setCurrent}
    };
    //Exportamos un componente de tipo Provider
    return <PanelContext.Provider value={value}>{props.children}</PanelContext.Provider>;
}

//Debemos exportar el contexto y el provider

//Hook personalizado
export function useUserContext() {
    return useContext(PanelContext);
}