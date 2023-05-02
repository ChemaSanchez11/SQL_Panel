import React, {useContext, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/main.css'
import '../css/sweetalert.css';
import Nav from "./Nav.jsx";
import ServersList from "./ServersList.jsx";
import ModalAddHost from "./ModalAddHost";
import ModalInfo from "./ModalInfo.jsx";
import {UserContext} from "../contexts/UserContext.jsx";

function Home() {



    const [servers, setServers] = useState([]);
    const [status, setStatus] = useState();

    document.body.classList.add('bg-dark');
    document.body.classList.remove('bg-gradient');

    return (
        <React.Fragment>
            <Nav status={status}/>
            <div className="bg-dark d-flex">
                <ServersList servers={servers} setServers={setServers} setStatus={setStatus}/>
            </div>
            <ModalAddHost servers={servers} setServers={setServers}/>
            <ModalInfo/>
        </React.Fragment>
    );
}

export default Home;