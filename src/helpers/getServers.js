async function getServers() {
    const url = '/api/get_servers';
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (e) {
        console.error(e);
    }
}

export default getServers;