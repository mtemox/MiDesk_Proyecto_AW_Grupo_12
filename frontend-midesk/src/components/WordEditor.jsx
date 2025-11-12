// src/components/WordEditor.jsx
import React, { useState, useRef } from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Undo, Redo, Download, Type, Palette, Sparkles
} from 'lucide-react';

function WordEditor() {
  const [fontSize, setFontSize] = useState('16');
  const [textColor, setTextColor] = useState('#000000');
  const editorRef = useRef(null);
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  // Aplicar formato con execCommand
  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // Cambiar tamaño de fuente
  const changeFontSize = (size) => {
    setFontSize(size);
    applyFormat('fontSize', '7'); // Truco: usar tamaño 7 de HTML
    // Luego aplicamos el tamaño real con CSS
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = size + 'px';
      range.surroundContents(span);
    }
  };

  // Cambiar color de texto
  const changeColor = (color) => {
    setTextColor(color);
    applyFormat('foreColor', color);
  };

  // Exportar a texto plano
  const exportToText = () => {
    const content = editorRef.current?.innerText || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documento.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Mejorar texto con IA de Claude
  const improveWithAI = async () => {
    const content = editorRef.current?.innerText || '';
    
    if (!content.trim()) {
      alert('Escribe algo primero para que la IA pueda mejorarlo.');
      return;
    }

    setIsAIProcessing(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `Mejora el siguiente texto haciéndolo más claro, profesional y bien estructurado. Mantén el mensaje original pero mejora la redacción, gramática y estilo. Devuelve SOLO el texto mejorado, sin explicaciones adicionales:\n\n${content}`
            }
          ]
        })
      });

      const data = await response.json();
      const improvedText = data.content[0].text;

      // Reemplazar el contenido con el texto mejorado
      if (editorRef.current) {
        editorRef.current.innerHTML = improvedText.split('\n').map(p => `<p>${p}</p>`).join('');
      }
    } catch (error) {
      console.error('Error al mejorar con IA:', error);
      alert('Hubo un error al conectar con la IA. Por favor intenta de nuevo.');
    } finally {
      setIsAIProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Barra de Herramientas */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-800 border-b border-purple-500/30">
        
        {/* Deshacer/Rehacer */}
        <div className="flex gap-1 border-r border-gray-600 pr-2">
          <button
            onClick={() => applyFormat('undo')}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Deshacer"
          >
            <Undo size={18} />
          </button>
          <button
            onClick={() => applyFormat('redo')}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Rehacer"
          >
            <Redo size={18} />
          </button>
        </div>

        {/* Formato de Texto */}
        <div className="flex gap-1 border-r border-gray-600 pr-2">
          <button
            onClick={() => applyFormat('bold')}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Negrita"
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => applyFormat('italic')}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Cursiva"
          >
            <Italic size={18} />
          </button>
          <button
            onClick={() => applyFormat('underline')}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Subrayado"
          >
            <Underline size={18} />
          </button>
        </div>

        {/* Tamaño de Fuente */}
        <div className="flex items-center gap-2 border-r border-gray-600 pr-2">
          <Type size={18} />
          <select
            value={fontSize}
            onChange={(e) => changeFontSize(e.target.value)}
            className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
          >
            <option value="12">12</option>
            <option value="14">14</option>
            <option value="16">16</option>
            <option value="18">18</option>
            <option value="20">20</option>
            <option value="24">24</option>
            <option value="28">28</option>
            <option value="32">32</option>
          </select>
        </div>

        {/* Color de Texto */}
        <div className="flex items-center gap-2 border-r border-gray-600 pr-2">
          <Palette size={18} />
          <input
            type="color"
            value={textColor}
            onChange={(e) => changeColor(e.target.value)}
            className="w-8 h-8 cursor-pointer rounded"
            title="Color de texto"
          />
        </div>

        {/* Alineación */}
        <div className="flex gap-1 border-r border-gray-600 pr-2">
          <button
            onClick={() => applyFormat('justifyLeft')}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Alinear a la izquierda"
          >
            <AlignLeft size={18} />
          </button>
          <button
            onClick={() => applyFormat('justifyCenter')}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Centrar"
          >
            <AlignCenter size={18} />
          </button>
          <button
            onClick={() => applyFormat('justifyRight')}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Alinear a la derecha"
          >
            <AlignRight size={18} />
          </button>
        </div>

        {/* Listas */}
        <div className="flex gap-1 border-r border-gray-600 pr-2">
          <button
            onClick={() => applyFormat('insertUnorderedList')}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Lista con viñetas"
          >
            <List size={18} />
          </button>
          <button
            onClick={() => applyFormat('insertOrderedList')}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Lista numerada"
          >
            <ListOrdered size={18} />
          </button>
        </div>

        {/* Botón de IA */}
        <button
          onClick={improveWithAI}
          disabled={isAIProcessing}
          className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 
                   disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors"
          title="Mejorar con IA"
        >
          <Sparkles size={18} />
          {isAIProcessing ? 'Mejorando...' : 'Mejorar con IA'}
        </button>

        {/* Exportar */}
        <button
          onClick={exportToText}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 
                   rounded transition-colors ml-auto"
          title="Exportar a TXT"
        >
          <Download size={18} />
          Exportar
        </button>
      </div>

      {/* Área de Edición */}
      <div
        ref={editorRef}
        contentEditable
        className="flex-1 p-6 overflow-auto focus:outline-none bg-white text-gray-900"
        style={{
          minHeight: '100%',
          fontSize: `${fontSize}px`,
          lineHeight: '1.6'
        }}
        suppressContentEditableWarning
      >
        <p>Empieza a escribir tu documento aquí...</p>
        <p>Usa la barra de herramientas para dar formato a tu texto.</p>
        <p>¡Haz clic en "Mejorar con IA" para que Claude mejore tu redacción!</p>
      </div>
    </div>
  );
}

export default WordEditor;