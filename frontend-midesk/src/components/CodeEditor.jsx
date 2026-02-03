// src/components/CodeEditor.jsx
import React, { useState, useEffect } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { Save, Columns, Code as CodeIcon, FileCode } from 'lucide-react';
import { toast } from 'react-toastify';
import { useFetch } from '../hooks/useFetch';
import { useSocket } from '../context/SocketContext';
import { useSearchParams } from 'react-router-dom';

const CodeEditor = ({ fileId, fileName, initialContent = "" }) => {
  // Estado del código actual
  const [code, setCode] = useState(initialContent);
  // Estado del código original (lo último guardado en BD)
  const [originalCode, setOriginalCode] = useState(initialContent);
  
  const [language, setLanguage] = useState('javascript');
  const [showDiff, setShowDiff] = useState(false);

  const { socket } = useSocket();
  const [searchParams] = useSearchParams();
  
  const fetchDataBackend = useFetch();

  // Actualizar si cambian las props (ej. al abrir otro archivo)
  useEffect(() => {
    setCode(initialContent);
    setOriginalCode(initialContent);
  }, [initialContent]);

  // --- 3. LOGICA DE SOCKET (NUEVO) ---
  useEffect(() => {
    if (!socket) return;

    // Escuchar cambios de código de otros usuarios
    socket.on('code-change', (data) => {
       // Si nos llega contenido nuevo, actualizamos el estado
       if (data.content !== code) {
           setCode(data.content);
       }
       // Opcional: Sincronizar también el lenguaje si cambió
       if (data.language && data.language !== language) {
           setLanguage(data.language);
       }
    });

    return () => {
        socket.off('code-change');
    };
  }, [socket, code, language]);

  // --- 4. FUNCIÓN PARA EMITIR CAMBIOS ---
  const handleEditorChange = (value) => {
     setCode(value); // Actualizar localmente

     // Emitir al socket
     if (socket) {
        const user = JSON.parse(localStorage.getItem('user'));
        const remoteId = searchParams.get('remote');
        const targetUserId = remoteId || user.id;

        socket.emit('code-change', { 
            userId: targetUserId, // <--- ENVIAMOS A LA SALA DEL DUEÑO
            content: value,
            language 
        });
     }
  };

  // --- FUNCIÓN GUARDAR ---
  const handleSave = async () => {
    if (!fileId || fileId.toString().startsWith('sys-')) {
      toast.info("Modo simulación. Crea un archivo real de código para guardar.");
      return;
    }

    const token = localStorage.getItem('token');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      await fetchDataBackend(
        `${backendUrl}/files/${fileId}`,
        { content: code }, // Enviamos el código como string
        "PUT",
        { Authorization: `Bearer ${token}` }
      );
      
      // Actualizamos el "original" para que el Diff sepa que ya guardamos
      setOriginalCode(code);
      // toast.success manejado por useFetch
      
      window.dispatchEvent(new CustomEvent('local-file-update', { detail: { id: fileId, content: code } }));

    } catch (error) {
      console.error("Error al guardar código:", error);
    }
  };

  // --- CAMBIAR LENGUAJE ---
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    // Opcional: Emitir cambio de lenguaje también
    if(socket) {
        const user = JSON.parse(localStorage.getItem('user'));
        socket.emit('code-change', { userId: user.id, content: code, language: newLang });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e2e] text-white">
      
      {/* --- BARRA DE HERRAMIENTAS PREMIUM --- */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-b from-[#252536] to-[#1f1f2e] border-b border-white/10 backdrop-blur-xl">
        
        {/* Nombre del Archivo con Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/40 rounded-lg border border-white/5">
           <FileCode size={15} className="text-blue-400" strokeWidth={2.5} />
           <span className="text-xs font-medium text-gray-200 tracking-wide">{fileName || "Sin título"}</span>
        </div>

        {/* Separador */}
        <div className="h-6 w-px bg-white/10 mx-1"></div>

        {/* Botón Guardar - Destacado */}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200 hover:scale-105 font-medium text-sm"
          title="Guardar cambios"
        >
          <Save size={15} strokeWidth={2.5} />
          <span>Guardar</span>
        </button>

        {/* Toggle Vista Dividida - Estilo Switch */}
        <button
          onClick={() => setShowDiff(!showDiff)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border
            ${showDiff 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent shadow-lg shadow-purple-500/20 text-white hover:scale-105' 
              : 'bg-gray-700/30 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
            }`}
          title={showDiff ? "Volver a Edición" : "Comparar cambios"}
        >
          <Columns size={15} strokeWidth={2.5} />
          <span className="hidden sm:inline">{showDiff ? "Ocultar Diff" : "Comparar"}</span>
        </button>

        <div className="flex-1"></div>

        {/* Selector de Lenguaje - Diseño Premium */}
        <div className="flex items-center gap-2 bg-gray-700/30 px-3 py-1.5 rounded-lg border border-white/10 hover:border-blue-400/50 transition-colors">
            <CodeIcon size={14} className="text-gray-400" strokeWidth={2} />
            <select 
                value={language} 
                onChange={handleLanguageChange}
                className="bg-transparent text-gray-200 text-sm font-medium outline-none cursor-pointer hover:text-blue-400 transition-colors"
                style={{ minWidth: '100px' }}
            >
                <option value="javascript" className="bg-[#252536]">JavaScript</option>
                <option value="python" className="bg-[#252536]">Python</option>
                <option value="html" className="bg-[#252536]">HTML</option>
                <option value="css" className="bg-[#252536]">CSS</option>
                <option value="json" className="bg-[#252536]">JSON</option>
                <option value="cpp" className="bg-[#252536]">C++</option>
                <option value="java" className="bg-[#252536]">Java</option>
            </select>
        </div>
      </div>

      {/* --- ÁREA DEL EDITOR --- */}
      <div className="flex-1 overflow-hidden relative">
        {showDiff ? (
          // VISTA DIVIDIDA (COMPARACIÓN)
          <DiffEditor
            height="100%"
            language={language}
            theme="vs-dark"
            original={originalCode} // Código guardado
            modified={code}         // Código actual (sin guardar)
            options={{
                renderSideBySide: true,
                readOnly: true,
                minimap: { enabled: false }
            }}
          />
        ) : (
          // EDITOR NORMAL
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        )}
      </div>

      {/* Barra de estado inferior - Estilo macOS */}
      <div className="px-4 py-1.5 bg-gradient-to-b from-[#252536] to-[#1f1f2e] border-t border-white/10 flex justify-between items-center text-[10px] text-gray-400 font-mono backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${showDiff ? 'bg-purple-400 animate-pulse' : 'bg-emerald-400'}`}></div>
            {showDiff ? "Comparación Activa" : "Editando"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-500">Líneas: <span className="text-blue-400 font-semibold">{code ? code.split('\n').length : 0}</span></span>
          <span className="text-gray-500">Lenguaje: <span className="text-purple-400 font-semibold">{language.toUpperCase()}</span></span>
        </div>
      </div>

    </div>
  );
};

export default CodeEditor;