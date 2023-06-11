/**
 * @description Esta función realiza una solicitud POST a la URL '/api/get_rows' para obtener los datos de esa tabla.
 *
 * @param {object} data - Objecto con database y tabla a la que vamos a consultar.
 * @returns {Promise} - Promesa con las datos de esa tabla en formato JSON.
 */
async function getRows(data) {

    const url = '/api/get_rows';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data)
    };

    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (e) {
        console.error(e);
    }
}

export default getRows;