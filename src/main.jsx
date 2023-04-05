import React, {useEffect, useState} from "react";
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/main.css'
import "./css/sweetalert.css";
import Nav from "./components/Nav.jsx";
import ServersList from "./components/ServersList.jsx";
import ModalAddHost from "./components/ModalAddHost";
import ModalInfo from "./components/ModalInfo.jsx";
import Login from "./components/Login.jsx";

function Main() {
    const [servers, setServers] = useState([]);
    const [status, setStatus] = useState();

    document.body.classList.add('bg-dark');

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

ReactDOM.createRoot(document.getElementById('root')).render(
    // <Main/>
    <Login></Login>
);