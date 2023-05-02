//Importamos create context que permite crear el contexto
import {createContext, useContext, useState} from "react";

export const UserContext = createContext();

//Creamos el provider que permite envolver a los componentes que les quiero mandr el contexto
export function ContextUserProvider(props) {
    //Ponemos lo que queremos que se vean en los componentes
    const [user, setUser] = useState(false);
    const value = {user, setUser};
    //Exportamos un componente de tipo Provider
    return <UserContext.Provider value={value}>{props.children}</UserContext.Provider>;
}

//Debemos exportar el contexto y el provider

//Hook personalizado
export function useUserContext() {
    return useContext(UserContext);
}