import React, {useContext, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/main.css'
import '../css/sweetalert.css';
import Nav from "./Nav.jsx";
import ServersList from "./ServersList.jsx";
import ModalAddHost from "./ModalAddHost";
import ModalInfo from "./ModalInfo.jsx";
import Main from "./Main.jsx";

function Home() {

    const [servers, setServers] = useState([]);
    const [status, setStatus] = useState();
    const [main, setMain] = useState({});

    document.body.classList.add('bg-dark');
    document.body.classList.remove('bg-gradient');

    return (
        <>
            <Nav status={status} setMain={setMain}/>
            <div className="row w-100">
                <ServersList servers={servers} setServers={setServers} setStatus={setStatus} setMain={setMain}/>
                <Main main={main}/>
            </div>
            <ModalAddHost servers={servers} setServers={setServers}/>
            <ModalInfo/>
        </>
    );
}

export default Home;