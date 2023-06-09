async function userRegister(data) {

    //Codificamos la contraseña en base64
    data.password = btoa(data.password);

    const url = '/external_api/register';
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