/**
 * @description Esta función realiza una solicitud POST a la URL '/api/connect' para obtener los databases asociadas a esa conexion.
 *
 * @param {object} data - Dentro de la propierdad server hay un string codificado en OpenSSL, es una cadena con host, user, password y port separado por '_'.
 * @returns {Promise} - Promesa con las databases de esa conexion en formato JSON.
 */
async function connectServer(data) {
    const url = '/api/connect';
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

export default connectServer;