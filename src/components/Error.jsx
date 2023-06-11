import 'react';
import {Link, useRouteError} from "react-router-dom";

function Error() {

    const error = useRouteError();
    console.log(error);

    return (
        <div className="text-danger text-center">
            <h1>{error.status} {error.statusText || error.message} </h1>
            <Link to="/">Volver</Link>
        </div>
    )
}

export default Error
