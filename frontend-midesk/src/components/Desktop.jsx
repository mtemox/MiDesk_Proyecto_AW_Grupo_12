// src/components/Desktop.jsx

import React, { useState, useEffect } from 'react'; // <-- PASO 1
import AppWindow from './AppWindow';
import ContextMenu from './ContextMenu';
import Icon from './Icon'; 
import backgroundImageUrl from '../assets/wallpapers/mi-fondo.jpg';
import Modal from './Modal'; // <-- NUEVO: Importar Modal
import NewLinkForm from './NewLinkForm'; // <-- NUEVO: Importar Formulario

import CodeEditor from './CodeEditor'; // <-- NUEVO
import CodeComparator from './DiffEditor'; // <-- NUEVO

import noteIcon from '../assets/icons/note.png'; // (Deberás conseguir esta imagen)
import codeIcon from '../assets/icons/code.png'; // (Deberás conseguir esta imagen)
import weatherIcon from '../assets/icons/weather.png'; // (Necesitarás un icono de clima)
import newsIcon from '../assets/icons/news.png';

import WeatherWidget from './widgets/WeatherWidget';
import NewsWidget from './widgets/NewsWidget';

// --- SIMULACIÓN DE DATOS DEL BACKEND ---
// (En el futuro, esto vendrá de una API real)
// Traemos las imágenes que ya tenías
import folderIcon from '../assets/icons/folder.png';
import computerIcon from '../assets/icons/desktop.png';
import linkIcon from '../assets/icons/link.png'; // <-- Añadimos un icono de enlace para SB-F-005

const mockIconsData = [
  {
    _id: '1',
    nombre: 'Mis Proyectos',
    imgSrc: folderIcon,
    type: 'folder'
  },
  {
    _id: '2',
    nombre: 'Mi Equipo',
    imgSrc: computerIcon,
    type: 'computer'
  },
  {
    _id: '3',
    nombre: 'Google',
    imgSrc: linkIcon,
    type: 'link',
    url: 'https://google.com' // <-- Dato extra que usaremos en SB-F-005
  },
  {
    _id: '4',
    nombre: 'Bloc de Notas',
    imgSrc: noteIcon,
    type: 'app',
    appId: 'notepad' // Un ID para saber qué app abrir
  },
  {
    _id: '5',
    nombre: 'Editor de Código',
    imgSrc: codeIcon,
    type: 'app',
    appId: 'codeEditor'
  },
  {
    _id: '6',
    nombre: 'Comparar Código (JS)',
    imgSrc: codeIcon, // Reusamos el icono
    type: 'app',
    appId: 'diffEditor'
  },
  {
    _id: '7',
    nombre: 'Clima',
    imgSrc: weatherIcon,
    type: 'app',
    appId: 'weather',
    // ¡NUEVO! Opciones de ventana para este icono
    windowOptions: { defaultWidth: 300, defaultHeight: 350 }
  },
  {
    _id: '8',
    nombre: 'Noticias Tech',
    imgSrc: newsIcon,
    type: 'app',
    appId: 'news',
    windowOptions: { defaultWidth: 400, defaultHeight: 500 }
  }
];
// --- FIN SIMULACIÓN ---


function Desktop() {
  
  // PASO 2: Crear el estado para los íconos
  const [icons, setIcons] = useState([]);

  // <-- NUEVO: Estado para el menú contextual
  // 'isVisible': si se muestra o no
  // 'x' e 'y': dónde se muestra
  const [menuState, setMenuState] = useState({
    isVisible: false,
    x: 0,
    y: 0,
  });

  // <-- NUEVO: Estado para controlar el modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  // ¡NUEVO! Estado para las ventanas abiertas
  // Será un array de objetos
  const [openWindows, setOpenWindows] = useState([]);

  // ¡NUEVO! Contador para el z-index (para saber cuál va encima)
  const [nextZ, setNextZ] = useState(10); // Empezamos en z-10

  // PASO 3: Simular la carga de datos (fetch)
  useEffect(() => {
    // En el futuro, aquí iría tu llamada a:
    // axios.get('/api/icons', { headers: { Authorization: token } })
    
    // Por ahora, usamos los datos simulados
    setIcons(mockIconsData);
    
    // El array vacío [] significa que esto se ejecuta solo 1 vez
    // cuando el componente se monta (como un "componentDidMount").
  }, []); 

  // <-- NUEVO: Manejador para el Clic Derecho
  const handleContextMenu = (e) => {
    // ¡SÚPER IMPORTANTE!
    // Esto previene que aparezca el menú
    // normal del navegador (Copiar, Pegar, Inspeccionar...)
    e.preventDefault(); 

    // Ocultamos el menú si ya estaba visible
    // (para evitar menús duplicados si hace clic derecho varias veces)
    if (menuState.isVisible) {
      setMenuState({ ...menuState, isVisible: false });
    }

    // Mostramos nuestro menú en la posición del cursor (e.clientX y e.clientY)
    setMenuState({
      isVisible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  // <-- NUEVO: Manejador para cerrar el menú
  // Si el usuario hace clic izquierdo en cualquier
  // parte del escritorio, ocultamos el menú.
  const handleCloseMenu = () => {
    if (menuState.isVisible) {
      setMenuState({ ...menuState, isVisible: false });
    }
  };

  // --- NUEVAS FUNCIONES PARA EL MODAL ---

  // <-- NUEVO: Cierra el Menú y Abre el Modal
  const handleOpenNewLinkModal = () => {
    handleCloseMenu(); // Cierra el menú contextual
    setIsModalVisible(true); // Abre el modal
  };

  // <-- NUEVO: Cierra el Modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // <-- NUEVO: Lógica para SB-F-004 (Crear ícono y actualizar UI)
  const handleCreateLink = (formData) => {
    // formData es el objeto { name, url } que recibimos del formulario
    
    // Tarea: Implementar la lógica para enviar la solicitud de creación al backend.
    // (SIMULACIÓN)
    // Cuando tengamos backend, aquí iría:
    // try {
    //   const response = await axios.post('/api/icons', { ... });
    //   setIcons(currentIcons => [...currentIcons, response.data]);
    // } catch (error) { ... }

    // Tarea: Actualizar la UI del escritorio con el nuevo ícono.
    // (SIMULACIÓN)
    // Creamos un nuevo ícono "falso" como si el backend nos lo devolviera
    const newIcon = {
      _id: Date.now().toString(), // ID único temporal
      nombre: formData.name,
      imgSrc: linkIcon, // Usamos el ícono de enlace que ya importamos
      type: 'link',
      url: formData.url
    };

    // Añadimos el nuevo ícono a nuestro estado
    setIcons(currentIcons => [...currentIcons, newIcon]);
    
    // Cerramos el modal
    closeModal();
  };

  // --- NUEVAS FUNCIONES PARA GESTIONAR VENTANAS ---

  const openWindow = (appId, title, windowOptions) => {
    const newWindowId = Date.now(); // ID único para la ventana
    const newZ = nextZ + 1; // El z-index más alto hasta ahora

    const newWindow = {
      id: newWindowId,
      appId: appId, // 'notepad', 'codeEditor', etc.
      title: title,
      zIndex: newZ,
      ...windowOptions // <-- ¡AQUÍ ESTÁ LA MAGIA!
    };

    // Añadimos la nueva ventana al estado
    setOpenWindows(currentWindows => [...currentWindows, newWindow]);
    // Actualizamos el contador de z-index
    setNextZ(newZ);
  };

  const closeWindow = (windowId) => {
    setOpenWindows(currentWindows => 
      currentWindows.filter(win => win.id !== windowId)
    );
  };

  const focusWindow = (windowId) => {
    // Si la ventana ya está al frente, no hacemos nada
    if (openWindows.find(win => win.id === windowId)?.zIndex === nextZ) {
      return;
    }

    const newZ = nextZ + 1;
    setOpenWindows(currentWindows =>
      currentWindows.map(win => 
        win.id === windowId ? { ...win, zIndex: newZ } : win
      )
    );
    setNextZ(newZ);
  };

  // --- FUNCIÓN PARA RENDERIZAR EL CONTENIDO DE LA APP ---
  // Esto decide qué mostrar DENTRO de la ventana
  const renderAppContent = (appId) => {
    switch (appId) {
      case 'notepad':
        return (
          <CodeEditor 
            language="plaintext" 
            initialValue="Escribe tus notas aquí...\n\nPuedes pedirle a la IA que mejore esto."
          />
        );
        
      case 'codeEditor':
        return (
          <CodeEditor 
            language="javascript"
            initialValue="console.log('¡Hola desde el editor de código!');"
          />
        );
        
      case 'diffEditor':
        const v1 = "function saludo() {\n  console.log('Hola');\n}";
        const v2 = "function saludo() {\n  console.log('Hola Mundo!');\n}";
        return (
          <CodeComparator 
            language="javascript"
            originalCode={v1}
            modifiedCode={v2}
          />
        );

        // ¡AÑADE ESTOS DOS CASOS! 👇
    case 'weather':
      return <WeatherWidget />;
      
    case 'news':
      return <NewsWidget />;
      
    default:
      return <div className="text-white p-4">App no encontrada</div>;
    }
  };

  


  return (
    <div className="w-full h-screen overflow-hidden" 

      // <-- MODIFICADO: Añadimos los manejadores de eventos
      onContextMenu={handleContextMenu} // Para clic derecho
      onClick={handleCloseMenu}        // Para clic izquierdo (cerrar)

    >

    <div 
    className="fixed inset-0 -z-10"
    style={{ 
      backgroundImage: `url(${backgroundImageUrl})`, 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      willChange: 'transform' // <-- CRÍTICO para GPU acceleration
    }}
    />

    
      {/* Contenedor para los íconos */}
      <div className="p-4 grid grid-cols-12 grid-rows-6 gap-2">
        
        {/* PASO 4: Mapear los íconos del estado */}
        {icons.map(icon => (
          <Icon 
            key={icon._id} // <-- ¡Muy importante para React!
            nombre={icon.nombre} 
            imgSrc={icon.imgSrc} 
            // Pasaremos todos los datos del ícono, nos servirá después
            iconData={icon} 
            // Pasamos la función de abrir ventana
            onOpen={openWindow}
          />
        ))}
        
        {/* Los íconos "a mano" se han eliminado */}
        
      </div>

      {/* <-- NUEVO: Renderizamos el Menú Contextual 
        Le pasamos su visibilidad y posición desde el estado.
        Siempre está en el DOM, pero 'ContextMenu.jsx'
        decide si mostrarse (return null) o no.
      */}
      {/* Menú Contextual (MODIFICADO) */}
      <ContextMenu 
        isVisible={menuState.isVisible} 
        x={menuState.x} 
        y={menuState.y} 
        onNewLink={handleOpenNewLinkModal} // <-- Le pasamos la nueva función
      />

      {/* Modal (NUEVO) */}
      <Modal 
        isVisible={isModalVisible} 
        onClose={closeModal} 
        title="Crear Nuevo Enlace Web"
      >
        {/* Pasamos el formulario como 'children' del modal */}
        <NewLinkForm onSubmit={handleCreateLink} />
      </Modal>

      {/* --- NUEVO: RENDERIZAR LAS VENTANAS ABIERTAS --- */}
      <div className="windows-container">
        {openWindows.map(win => (
          <AppWindow
            key={win.id}
            title={win.title}
            zIndex={win.zIndex}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            // ¡NUEVO! Pasamos los tamaños a la ventana
            defaultWidth={win.defaultWidth}
            defaultHeight={win.defaultHeight}
          >
            {/* Renderizamos el contenido específico de la app */}
            {renderAppContent(win.appId)}
          </AppWindow>
        ))}
      </div>

    </div>
  );
}

export default Desktop;