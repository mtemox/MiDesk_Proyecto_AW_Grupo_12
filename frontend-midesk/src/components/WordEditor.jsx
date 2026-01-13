// src/components/WordEditor.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Undo, Redo, Download, Type, Palette, Sparkles, Save // <--- AÑADIDO SAVE
} from 'lucide-react';
import { toast } from 'react-toastify'; // <--- AÑADIDO
import { useFetch } from '../hooks/useFetch'; // <--- AÑADIDO

// AHORA RECIBE PROPS DEL SISTEMA
function WordEditor({ fileId, fileName, initialContent = "" }) {
  const [fontSize, setFontSize] = useState('16');
  const [textColor, setTextColor] = useState('#000000');
  const editorRef = useRef(null);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  
  const fetchDataBackend = useFetch(); // <--- HOOK PARA BACKEND

  // --- CARGAR CONTENIDO INICIAL ---
  useEffect(() => {
    if (editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  // Aplicar formato con execCommand
  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // Cambiar tamaño de fuente
  const changeFontSize = (size) => {
    setFontSize(size);
    applyFormat('fontSize', '7'); 
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
    a.download = fileName ? `${fileName}.txt` : 'documento.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- NUEVA FUNCIÓN: GUARDAR EN BACKEND ---
  const handleSave = async () => {
    // 1. VALIDACIÓN CRÍTICA: NO GUARDAR SI ES APP DE SISTEMA
    if (!fileId || fileId.toString().startsWith('sys-')) {
      toast.info("Este es un editor temporal. Crea un archivo real (Clic derecho -> Nuevo) para guardar.");
      return;
    }

    const content = editorRef.current?.innerHTML || ""; // Guardamos con formato HTML
    const token = localStorage.getItem('token');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      await fetchDataBackend(
        `${backendUrl}/files/${fileId}`,
        { content }, 
        "PUT",
        { Authorization: `Bearer ${token}` }
      );
      // El hook useFetch ya muestra el mensaje de éxito del backend
    } catch (error) {
      console.error("Error guardando:", error);
    }
  };

  // --- FUNCIÓN IA CORREGIDA: USAR TU BACKEND ---
  const improveWithAI = async () => {
    const content = editorRef.current?.innerText || ''; // Enviamos solo texto plano a la IA
    
    if (!content.trim()) {
      toast.warning('Escribe algo primero para que la IA pueda mejorarlo.');
      return;
    }

    setIsAIProcessing(true);
    const token = localStorage.getItem('token');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      // LLAMADA A TU BACKEND (NO A ANTHROPIC DIRECTO)
      const response = await fetchDataBackend(
        `${backendUrl}/ia/improve-text`,
        { text: content }, 
        "POST",
        { Authorization: `Bearer ${token}` }
      );

      if (response && response.ok && response.improvedText) {
        // Insertamos el texto mejorado
        if (editorRef.current) {
            // Nota: La IA devuelve texto plano, perdemos formato bold/italic en esta respuesta
            // pero mantenemos los párrafos.
            editorRef.current.innerText = response.improvedText;
            toast.success("¡Texto mejorado por IA!");
        }
      }

    } catch (error) {
      console.error('Error al mejorar con IA:', error);
      // toast.error manejado por useFetch
    } finally {
      setIsAIProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Barra de Herramientas - Estilo Windows 11/macOS */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-gradient-to-b from-gray-800 to-gray-850 border-b border-gray-700/50 backdrop-blur-xl">
        
        {/* --- BOTÓN GUARDAR DESTACADO --- */}
        <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200 hover:scale-105 mr-3 font-medium text-sm"
            title="Guardar en la Nube"
        >
            <Save size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">Guardar</span>
        </button>

        {/* Deshacer/Rehacer */}
        <div className="flex gap-0.5 mr-2">
          <button 
            onClick={() => applyFormat('undo')} 
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-150 active:scale-95 group"
            title="Deshacer"
          >
            <Undo size={16} strokeWidth={2} className="text-gray-300 group-hover:text-white" />
          </button>
          <button 
            onClick={() => applyFormat('redo')} 
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-150 active:scale-95 group"
            title="Rehacer"
          >
            <Redo size={16} strokeWidth={2} className="text-gray-300 group-hover:text-white" />
          </button>
        </div>

        {/* Separador Visual */}
        <div className="h-6 w-px bg-gray-700/50 mx-1"></div>

        {/* Formato Básico */}
        <div className="flex gap-0.5 mr-2">
          <button 
            onClick={() => applyFormat('bold')} 
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-150 active:scale-95 group"
            title="Negrita"
          >
            <Bold size={16} strokeWidth={2.5} className="text-gray-300 group-hover:text-white" />
          </button>
          <button 
            onClick={() => applyFormat('italic')} 
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-150 active:scale-95 group"
            title="Cursiva"
          >
            <Italic size={16} strokeWidth={2.5} className="text-gray-300 group-hover:text-white" />
          </button>
          <button 
            onClick={() => applyFormat('underline')} 
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-150 active:scale-95 group"
            title="Subrayado"
          >
            <Underline size={16} strokeWidth={2.5} className="text-gray-300 group-hover:text-white" />
          </button>
        </div>

        {/* Separador */}
        <div className="h-6 w-px bg-gray-700/50 mx-1"></div>

        {/* Fuente y Color - Diseño Premium */}
        <div className="flex items-center gap-2 bg-gray-700/30 px-3 py-1 rounded-lg mr-2">
          <Type size={15} className="text-gray-400" />
          <select 
            value={fontSize} 
            onChange={(e) => changeFontSize(e.target.value)} 
            className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer hover:text-blue-400 transition-colors"
            style={{ width: '45px' }}
          >
            <option value="12" className="bg-gray-800">12</option>
            <option value="16" className="bg-gray-800">16</option>
            <option value="20" className="bg-gray-800">20</option>
            <option value="24" className="bg-gray-800">24</option>
          </select>
          
          <div className="h-4 w-px bg-gray-600 mx-1"></div>
          
          <Palette size={15} className="text-gray-400" />
          <div className="relative">
            <input 
              type="color" 
              value={textColor} 
              onChange={(e) => changeColor(e.target.value)} 
              className="w-7 h-7 cursor-pointer rounded-md border-2 border-gray-600 hover:border-blue-400 transition-colors"
              title="Color de texto"
            />
          </div>
        </div>

        {/* Separador */}
        <div className="h-6 w-px bg-gray-700/50 mx-1"></div>

        {/* Alineación */}
        <div className="flex gap-0.5 mr-2">
          <button 
            onClick={() => applyFormat('justifyLeft')} 
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-150 active:scale-95 group"
            title="Alinear izquierda"
          >
            <AlignLeft size={16} strokeWidth={2} className="text-gray-300 group-hover:text-white" />
          </button>
          <button 
            onClick={() => applyFormat('justifyCenter')} 
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-150 active:scale-95 group"
            title="Centrar"
          >
            <AlignCenter size={16} strokeWidth={2} className="text-gray-300 group-hover:text-white" />
          </button>
        </div>

        <div className="flex-1"></div>

        {/* Botón de IA - Diseño Futurista */}
        <button
          onClick={improveWithAI}
          disabled={isAIProcessing}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-medium text-sm shadow-lg transition-all duration-200 mr-2
            ${isAIProcessing 
              ? 'bg-gradient-to-r from-purple-600/50 to-pink-600/50 text-gray-400 cursor-wait' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-105 shadow-purple-500/30'
            }`}
          title="Mejorar con IA"
        >
          <Sparkles size={16} strokeWidth={2.5} className={isAIProcessing ? 'animate-pulse' : ''} />
          <span>{isAIProcessing ? 'Procesando...' : 'IA'}</span>
        </button>

        {/* Exportar */}
        <button 
          onClick={exportToText} 
          className="p-2 hover:bg-emerald-600/20 rounded-lg transition-all duration-150 active:scale-95 group" 
          title="Descargar"
        >
          <Download size={16} strokeWidth={2.5} className="text-emerald-400 group-hover:text-emerald-300" />
        </button>
      </div>

      {/* Área de Edición */}
      <div
        ref={editorRef}
        contentEditable
        className="flex-1 p-6 overflow-auto focus:outline-none bg-white text-gray-900"
        style={{ minHeight: '100%', fontSize: `${fontSize}px`, lineHeight: '1.6' }}
        suppressContentEditableWarning
      >
        {/* El contenido inicial se carga vía useEffect */}
      </div>
      
      {/* Barra de estado */}
      <div className="px-4 py-1 bg-gray-800 text-[10px] text-gray-500 flex justify-between">
        <span>{fileId && !fileId.toString().startsWith('sys-') ? `Editando: ${fileName}` : 'Modo borrador (Sin guardar)'}</span>
      </div>
    </div>
  );
}

export default WordEditor;