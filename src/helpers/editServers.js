/**
 * @description Esta función realiza una solicitud POST a la URL '/api/edit_servers' para editar la conexion.
 *
 * @param {object} data - Objecto con datos del servidor, host, puerto, usuario y contraseña.
 * @returns {Promise} - Promesa con las conexiones del usuario en formato JSON.
 */
async function editServers(data) {
    const url = '/api/edit_servers';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data) //para enviar los datos con urlencoded
    };

    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (e) {
        console.error(e);
    }
}

export default editServers;