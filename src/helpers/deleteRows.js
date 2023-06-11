/**
 * @description Esta función realiza una solicitud POST a la URL '/api/add_server' para eliminar datos.
 *
 * @param {string} database
 * @param {string} table
 * @param {string} value String codificado en JSON con los valores a eliminar
 * @returns {Promise} - Promesa con el resultado de la query en foormato JSON.
 */
async function deleteRows(database, table, value) {
    const url = '/api/delete_rows';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({database: database, table: table, value: value}) //para enviar los datos con urlencoded
    };

    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (e) {
        console.error(e);
    }
}

export default deleteRows;