// src/components/Desktop.jsx

import React, { useState, useEffect } from 'react'; // <-- PASO 1
import { toast } from 'react-toastify'; // Para notificaciones
import { useFetch } from '../hooks/useFetch'; // Hook de conexión

// Componentes UI
import AppWindow from './AppWindow';
import ContextMenu from './ContextMenu';
import Icon from './Icon'; 
import Modal from './Modal'; // <-- NUEVO: Importar Modal
import NewLinkForm from './NewLinkForm'; // <-- NUEVO: Importar Formulario

// Widgets y Apps
import CodeEditor from './CodeEditor'; // <-- NUEVO
import CodeComparator from './DiffEditor'; // <-- NUEVO
import WeatherWidget from './widgets/WeatherWidget';
import NewsWidget from './widgets/NewsWidget';
import WallpaperWidget from './widgets/WallpaperWidget';
import WordEditor from './WordEditor';
import ProfileApp from './apps/ProfileApp';

// --- IMÁGENES E ÍCONOS ---
import codeIcon from '../assets/icons/code.png'; // (Deberás conseguir esta imagen)
import weatherIcon from '../assets/icons/weather.png'; // (Necesitarás un icono de clima)
import newsIcon from '../assets/icons/news.png';
import noteIcon from '../assets/icons/note.png'; // (Deberás conseguir esta imagen)
import wallpaperIcon from '../assets/icons/wallpaper.png'; // (Necesitarás un icono)
import backgroundImageUrl from '../assets/wallpapers/mi-fondo.jpg';
import folderIcon from '../assets/icons/folder.png';
import computerIcon from '../assets/icons/desktop.png';
import linkIcon from '../assets/icons/link.png'; // <-- Añadimos un icono de enlace para SB-F-005
import wordIcon from '../assets/icons/doc.png';


// --- SIMULACIÓN DE DATOS DEL BACKEND ---
// (En el futuro, esto vendrá de una API real)
// Traemos las imágenes que ya tenías

const systemApps = [
  {
    _id: 'sys-1',
    nombre: 'Clima',
    imgSrc: weatherIcon,
    type: 'app',
    appId: 'weather',
    windowOptions: { defaultWidth: 300, defaultHeight: 350 }
  },
  {
    _id: 'sys-2',
    nombre: 'Noticias',
    imgSrc: newsIcon,
    type: 'app',
    appId: 'news',
    windowOptions: { defaultWidth: 400, defaultHeight: 500 }
  },
  {
    _id: 'sys-3',
    nombre: 'Fondos',
    imgSrc: wallpaperIcon,
    type: 'app',
    appId: 'wallpaper',
    windowOptions: { defaultWidth: 500, defaultHeight: 350 }
  },
  {
    _id: 'sys-4',
    nombre: 'Word Pro',
    imgSrc: wordIcon,
    type: 'app',
    appId: 'wordprocessor',
    windowOptions: { defaultWidth: 700, defaultHeight: 500 }
  },
  {
    _id: 'sys-5',
    nombre: 'VS Code (Sim)',
    imgSrc: codeIcon,
    type: 'app',
    appId: 'codeEditor',
    windowOptions: { defaultWidth: 800, defaultHeight: 600 }
  },
  {
    _id: 'sys-6',
    nombre: 'Mi Equipo',
    imgSrc: computerIcon,
    type: 'computer'
  },
];

// --- HELPER: Mapear Tipo de BD a Imagen ---
const getIconImage = (type) => {
    switch (type) {
        case 'folder': return folderIcon;
        case 'link': return linkIcon;
        case 'note': return noteIcon;
        case 'code': return codeIcon;
        default: return linkIcon;
    }
};


function Desktop({ openWindows, onOpenWindow, onCloseWindow, onFocusWindow, onMinimizeWindow, onMaximizeWindow }) {
  
  // PASO 2: Crear el estado para los íconos
  const [icons, setIcons] = useState(systemApps);

  // <-- NUEVO: Estado para el menú contextual
  // 'isVisible': si se muestra o no
  // 'x' e 'y': dónde se muestra
  const [menuState, setMenuState] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    selectedItem: null
  });

  // <-- NUEVO: Estado para controlar el modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  // ¡NUEVO! Estado para las ventanas abiertas
  // Será un array de objetos
  // const [openWindows, setOpenWindows] = useState([]);

  // ¡NUEVO! Contador para el z-index (para saber cuál va encima)
  // const [nextZ, setNextZ] = useState(10); // Empezamos en z-10

  // Hook para peticiones
  const fetchDataBackend = useFetch();

  // PASO 3: Simular la carga de datos (fetch)
  useEffect(() => {
    const loadUserItems = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        
        try {
            // Hacemos GET /desktop enviando el Token
            const data = await fetchDataBackend(
                `${backendUrl}/desktop`,
                null, 
                "GET", 
                { Authorization: `Bearer ${token}` } // 👈 Header Auth
            );

            if (data && data.ok && data.items) {
                // Convertimos los ítems de la BD al formato del Frontend
                const userItems = data.items.map(item => ({
                    _id: item._id,
                    nombre: item.name,
                    imgSrc: getIconImage(item.type), // Asignamos imagen según tipo
                    type: item.type, // 'link', 'folder', etc.
                    url: item.url,   // Solo para links
                    // Mantenemos otros datos si hacen falta
                }));

                // Fusionamos Apps del Sistema + Ítems del Usuario
                setIcons([...systemApps, ...userItems]);
            }
        } catch (error) {
            console.error("Error cargando escritorio:", error);
        }
    };

    loadUserItems();
  }, []); // Se ejecuta al montar

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

  // 1. Clic en el Fondo (Escritorio vacío)
  const handleContextMenuDesktop = (e) => {
    e.preventDefault();
    setMenuState({ 
        isVisible: true, 
        x: e.clientX, 
        y: e.clientY, 
        selectedItem: null // No hay ítem seleccionado
    });
  };

  // 2. Clic en un Ícono (Pasado desde Icon.jsx)
  const handleContextMenuIcon = (e, iconData) => {
    e.preventDefault();
    e.stopPropagation(); // Evita que se dispare el del fondo
    setMenuState({ 
        isVisible: true, 
        x: e.clientX, 
        y: e.clientY, 
        selectedItem: iconData // Guardamos el ítem
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
  const handleCreateLink = async (formData) => {
    const token = localStorage.getItem('token');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Preparamos los datos para el Backend
    const newItemData = {
        type: 'link', // Por ahora solo links desde este modal
        name: formData.name,
        url: formData.url,
        x: 100, // Posición por defecto (podríamos aleatorizarla)
        y: 100
    };

    try {
        const response = await fetchDataBackend(
            `${backendUrl}/items`,
            newItemData,
            "POST",
            { Authorization: `Bearer ${token}` }
        );

        if (response && response.ok) {
            // Backend nos devuelve el ítem creado
            const createdItem = response.item;
            
            // Lo formateamos para la UI
            const newIconUI = {
                _id: createdItem._id,
                nombre: createdItem.name,
                imgSrc: linkIcon,
                type: 'link',
                url: createdItem.url
            };

            // Actualizamos el estado visualmente
            setIcons(prev => [...prev, newIconUI]);
            closeModal();
            toast.success("Enlace creado exitosamente");
        }
    } catch (error) {
        console.error("Error creando ítem:", error);
    }
  };

  // --- 3. CONSUMIR ENDPOINT DELETE (Nuevo) ---
  const handleDeleteItem = async (item) => {
    // Cerramos menú
    handleCloseMenu();

    // Verificamos si es app del sistema (no se pueden borrar)
    if (item._id.startsWith('sys-')) {
        toast.error("No puedes eliminar aplicaciones del sistema.");
        return;
    }

    const token = localStorage.getItem('token');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
        const response = await fetchDataBackend(
            `${backendUrl}/items/${item._id}`, // 👈 Endpoint SB-B-003 Delete
            null,
            "DELETE",
            { Authorization: `Bearer ${token}` }
        );

        if (response && response.ok) {
            // Actualizamos el estado local quitando el ítem
            setIcons(prev => prev.filter(icon => icon._id !== item._id));
            toast.success("Elemento eliminado");
        }
    } catch (error) {
        console.error("Error eliminando:", error);
    }
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

      case 'wallpaper':
        return <WallpaperWidget />;

      // case 'wordprocessor':
      //     return <RichTextEditor />;

      case 'wordprocessor':
          return <WordEditor />;
      
      case 'profile': 
          return <ProfileApp />; // 👈 NUEVO

      case 'notepad': 
          return <CodeEditor language="plaintext" initialValue="Notas..." />;
          
        default:
          return <div className="text-white p-4">App no encontrada</div>;
        }

  };

  


  return (
    <div className="w-full h-screen overflow-hidden" onContextMenu={handleContextMenu} onClick={handleCloseMenu}>
      
      {/* Fondo */}
      <div className="fixed inset-0 -z-10" 
           style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} 
      />

      {/* Grid de Íconos */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 content-start h-[calc(100vh-3rem)] overflow-y-auto">
        {icons.map(icon => (
          <Icon 
            key={icon._id} 
            nombre={icon.nombre} 
            imgSrc={icon.imgSrc} 
            iconData={icon} 
            onOpen={onOpenWindow}
            onContextMenu={handleContextMenuIcon}
          />
        ))}
      </div>

      {/* Menú Contextual y Modales */}
      <ContextMenu 
        isVisible={menuState.isVisible} 
        x={menuState.x} 
        y={menuState.y} 
        selectedItem={menuState.selectedItem}
        onNewLink={handleOpenNewLinkModal} 
        onDelete={handleDeleteItem}
      />

      <Modal isVisible={isModalVisible} onClose={closeModal} title="Nuevo Enlace Web">
        <NewLinkForm onSubmit={handleCreateLink} />
      </Modal>

      {/* Ventanas */}
      <div className="fixed inset-0 z-20 pointer-events-none">
        {openWindows.map(win => (
            <div key={win.id} style={{ display: win.isMinimized ? 'none' : 'block' }}>
              <AppWindow 
                // ... (tus props siguen igual)
                title={win.title} 
                zIndex={win.zIndex} 
                onClose={() => onCloseWindow(win.id)}
                onMinimize={() => onMinimizeWindow(win.id)}
                onMaximize={() => onMaximizeWindow(win.id)}
                onFocus={() => onFocusWindow(win.id)}
                isMaximized={win.isMaximized}
                defaultX={win.defaultX}
                defaultY={win.defaultY}
                defaultWidth={win.defaultWidth}
                defaultHeight={win.defaultHeight}
              >
                {renderAppContent(win.appId)}
              </AppWindow>
            </div>
        ))}
      </div>
    </div>
  );
}

export default Desktop;