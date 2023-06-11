/**
 * @description Esta función realiza una solicitud POST a la URL '/api/get_tables' para obtener las tablas de esa database.
 *
 * @param {object} data - Objecto con database a la que vamos a consultar.
 * @returns {Promise} - Promesa con las tablas de esa database en formato JSON.
 */
async function getTables(data) {
    const url = '/api/get_tables';
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

export default getTables;