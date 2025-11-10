import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';

// Recibe:
// - initialValue: El texto con el que debe empezar
// - language: 'javascript', 'python', 'cpp', 'markdown', 'plaintext'
function CodeEditor({ initialValue = '', language = 'plaintext' }) {
  const [value, setValue] = useState(initialValue);
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }
  
  // --- Función para tu IA ---
  // Esta función la podrías llamar desde un botón "Mejorar con IA"
  const getEditorContent = () => {
    if (editorRef.current) {
      return editorRef.current.getValue();
    }
    return '';
  };
  
  // (Aquí podrías añadir un botón que llame a getEditorContent y 
  // envíe el texto a tu backend de IA)
  
  return (
    <Editor
      height="100%" // Ocupa todo el espacio de la ventana
      width="100%"
      language={language}
      theme="vs-dark" // Tema oscuro (como tu app)
      value={value}
      onChange={(newValue) => setValue(newValue)}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false }, // Ocultar el minimapa
        fontSize: 14,
        wordWrap: 'on', // Para que el texto se ajuste (bueno para notas)
      }}
    />
  );
}

export default CodeEditor;