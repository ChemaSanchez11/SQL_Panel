import React from "react";
import AceEditor from "react-ace";

/**
 * @description Componente con el editor de querys AceEditor.
 * @returns {JSX.Element} - Elemento JSX que representa el componente editor de querys.
 */
function QueryBuilder() {

    /**
     * Reemplaza las palabras clave SELECT, FROM y WHERE en el código con una versión resaltada en HTML.
     *
     * @param {string} value - Query que se va a poner con el formato.
     * @returns {string} - Query modificada con las palabras clave resaltadas.
     */
    function handleCodeChange(value) {
        //Buscamos las palabras SELECT FROM y WHERE para reemplazarlo por una clase con su color
        return value.replace(/\b(SELECT|FROM|WHERE|INNER|JOIN|LEFT|RIGHT)\b/g, '<span class="keyword">$&</span>');
    }

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
