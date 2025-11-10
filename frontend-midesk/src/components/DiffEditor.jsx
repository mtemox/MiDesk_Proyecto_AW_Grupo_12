import React from 'react';
import { DiffEditor } from '@monaco-editor/react';

// Recibe:
// - originalCode: El código en la ventana izquierda
// - modifiedCode: El código en la ventana derecha
// - language: El lenguaje
function CodeComparator({ originalCode, modifiedCode, language }) {
  return (
    <DiffEditor
      height="100%"
      width="100%"
      language={language}
      theme="vs-dark"
      original={originalCode}
      modified={modifiedCode}
      options={{
        // Desactiva la edición en el comparador (solo lectura)
        readOnly: true, 
        renderSideBySide: true, // ¡Esta es la magia!
      }}
    />
  );
}

export default CodeComparator;