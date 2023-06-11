/**
 * @description Esta función realiza una solicitud POST a la URL '/api/get_servers' para obtener los servidores asociados a un usuario.
 * Utiliza el ID de usuario. Retorna una promesa que se resuelve con los servidores obtenidos en formato JSON.
 *
 * @param {string} user_id - ID del usuario para obtener los servidores.
 * @returns {Promise} - Promesa con los servidores obtenidos en formato JSON.
 */
async function getServers(user_id) {
    const url = '/api/get_servers';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({user_id: user_id}) //para enviar los datos con urlencoded
    };

    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (e) {
        console.error(e);
    }
}

export default getServers;