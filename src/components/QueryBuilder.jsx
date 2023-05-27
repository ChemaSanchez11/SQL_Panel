import React, {useContext, useState} from "react";
import AceEditor from "react-ace";
const QueryBuilder = () => {
    const handleCodeChange = (value) => {
        // Aquí puedes implementar la lógica para aplicar estilos a palabras clave
        // Por ejemplo, puedes usar expresiones regulares para resaltar las palabras clave

        const formattedText = value.replace(/\b(SELECT|FROM|WHERE)\b/g, '<span class="keyword">$&</span>');

        return formattedText;
    };

    return (
        <AceEditor
            mode="sql"
            theme="twilight" // Utiliza el tema "twilight"
            onChange={handleCodeChange}
            name="sql-editor"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="300px"
        />
    );
};

export default QueryBuilder;
