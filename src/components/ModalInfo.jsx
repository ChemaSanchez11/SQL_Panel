import favicon from '/icons/favicon.png'

function ModalInfo() {


    return (


        <div className="modal fade" id="modalInfo" tabIndex="-1" aria-labelledby="modalInfoLabel"
             aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header my-auto">
                        <img src={favicon} width="45" height="45" alt=""/>
                            <h3 className="modal-title ml-2" id="modalInfoLongTitle">Informacion</h3>
                            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                    </div>
                    <div className="modal-body">
                        El registro de las conexiones es guardada mediante el equipo que se utilice,
                        en otro equipo las conexiones cambiaran.
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalInfo;
