/**
 * @description Esta función realiza una solicitud POST a la URL '/api/edit_user' para editar el usuario.
 *
 * @param {object} data - Objecto con datos del usuario.
 * @returns {Promise} - Promesa con los datos del usuario en formato JSON.
 */
async function editUser(data) {

    const url = '/api/edit_user';
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

export default editUser;