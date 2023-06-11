/**
 * @description Esta función realiza una solicitud POST a la URL '/api/get_records' para ejecutar una query en el servidor.
 *
 * @param {string} database - String con la database donde se va a ejecutar la query.
 * @param {string} value - String con la query que se va a ejecutar.
 * @returns {Promise} - Promesa con la respuesta del servidor en formato JSON.
 */
async function getRecords(database, value) {
    const url = '/api/get_records';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({database: database, value: value})
    };

    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (e) {
        console.error(e);
    }
}

export default getRecords;