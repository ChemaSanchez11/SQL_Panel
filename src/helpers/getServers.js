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