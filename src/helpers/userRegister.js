/**
 * @description Esta función realiza una solicitud POST a la URL '/api/edit_user' para registrarse.
 *
 * @param {object} data - Objecto con datos del usuario.
 * @returns {Promise} - Promesa con los datos del usuario en formato JSON.
 */
async function userRegister(data) {

    //Codificamos la contraseña en base64
    data.password = btoa(data.password);

    const url = '/api/register';
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

export default userRegister;