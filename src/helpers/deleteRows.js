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