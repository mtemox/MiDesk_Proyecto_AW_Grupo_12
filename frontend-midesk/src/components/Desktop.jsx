// src/components/Desktop.jsx

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; 
import { useFetch } from '../hooks/useFetch';
import { useSocket } from '../context/SocketContext';
import { useSearchParams } from 'react-router-dom';
import ShareForm from './ShareForm';

// Componentes UI
import AppWindow from './AppWindow';
import ContextMenu from './ContextMenu';
import Icon from './Icon'; 
import Modal from './Modal'; // Importar Modal
import NewLinkForm from './NewLinkForm'; 
import FolderContent from './FolderContent';
import NewFolderForm from './NewFolderForm';
import ChatWidget from './widgets/ChatWidget';

// Widgets y Apps
import CodeEditor from './CodeEditor';
import CodeComparator from './DiffEditor';
import WeatherWidget from './widgets/WeatherWidget';
import NewsWidget from './widgets/NewsWidget';
import WallpaperWidget from './widgets/WallpaperWidget';
import WordEditor from './WordEditor';
import ProfileApp from './apps/ProfileApp';
import RecommendationsWidget from './widgets/RecommendationsWidget';
import SettingsApp from './apps/SettingsApp';

// Imágenes e Íconos
import codeIcon from '../assets/icons/code.png'; 
import weatherIcon from '../assets/icons/weather.png'; 
import newsIcon from '../assets/icons/news.png';
import noteIcon from '../assets/icons/note.png'; 
import wallpaperIcon from '../assets/icons/wallpaper.png'; 
import backgroundImageUrl from '../assets/wallpapers/mi-fondo.jpg';
import defaultWallpaper from '../assets/wallpapers/mi-fondo.jpg';
import folderIcon from '../assets/icons/folder.png';
import computerIcon from '../assets/icons/desktop.png';
import linkIcon from '../assets/icons/link.png'; 
import wordIcon from '../assets/icons/doc.png';
import aiIcon from '../assets/icons/chat.png';


// --- SIMULACIÓN DE DATOS DEL BACKEND ---
// (En el futuro, esto vendrá de una API real)
// Traemos las imágenes que ya tenías

const systemAppsBase = [
  { 
    _id: 'sys-9',
    nombre: 'Chat MiDesk', 
    imgSrc: aiIcon, 
    type: 'app', 
    appId: 'ai-chat', 
    windowOptions: { defaultWidth: 400, defaultHeight: 600 } 
  },
  { _id: 'sys-8', nombre: 'Asistente IA', imgSrc: aiIcon, type: 'app', appId: 'ai-recommendations' },
  { _id: 'sys-7', nombre: 'Bloc de Notas', imgSrc: noteIcon, type: 'app', appId: 'notepad' },
  
  { _id: 'sys-6', nombre: 'Mi Equipo', imgSrc: computerIcon, type: 'computer' },
  { _id: 'sys-5', nombre: 'VS Code (Sim)', imgSrc: codeIcon, type: 'app', appId: 'codeEditor' },
  { _id: 'sys-4', nombre: 'Word Pro', imgSrc: wordIcon, type: 'app', appId: 'wordprocessor' },
  { _id: 'sys-3', nombre: 'Fondos', imgSrc: wallpaperIcon, type: 'app', appId: 'wallpaper' },
  { _id: 'sys-2', nombre: 'Noticias', imgSrc: newsIcon, type: 'app', appId: 'news' },
  { _id: 'sys-1', nombre: 'Clima', imgSrc: weatherIcon, type: 'app', appId: 'weather' },
];

// --- HELPER: Mapear Tipo de BD a Imagen ---
const getIconImage = (type) => {
    switch (type) {
        case 'folder': return folderIcon;
        case 'link': return linkIcon;
        case 'note': return wordIcon;
        case 'code': return codeIcon;
        default: return linkIcon;
    }
};


function Desktop({ openWindows, onOpenWindow, onCloseWindow, onFocusWindow, onMinimizeWindow, onMaximizeWindow, onDragStop }) {
  
  // PASO 2: Crear el estado para los íconos
  const [icons, setIcons] = useState([])

  const [currentWallpaper, setCurrentWallpaper] = useState(defaultWallpaper);
  
  // Socket
  const { socket } = useSocket();
  const [searchParams] = useSearchParams();
  const remoteId = searchParams.get('remote');

  // DETECTAR MODO REMOTO
  const remoteUserId = searchParams.get('remote');
  const remoteUserName = searchParams.get('name');
  const isRemote = !!remoteUserId; // Booleano

  // --- CONFIGURACIÓN DE LA REJILLA ---
  const CELL_WIDTH = 100;
  const CELL_HEIGHT = 110;

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

  // Hook para peticiones
  const fetchDataBackend = useFetch();

  // modalMode puede ser: 'link' | 'folder' | null
  const [modalMode, setModalMode] = useState(null);

  // --- FUNCIÓN PARA CALCULAR POSICIONES SEGÚN RESOLUCIÓN ---
  const calculateSystemPositions = () => {
  const marginX = 10; // Más pegado a la izquierda
  const marginY = 10; // Más pegado arriba
  const iconWidth = 90; // Ancho del icono (74) + pequeño espacio
  const iconHeight = 100; // Alto del icono (88) + pequeño espacio
  const taskbarHeight = 55; // Espacio de seguridad para tu taskbar
  
  const availableHeight = window.innerHeight - taskbarHeight - marginY;

  return systemAppsBase.map((app, index) => {
    const iconsPerCol = Math.floor(availableHeight / iconHeight);
    const col = Math.floor(index / iconsPerCol);
    const row = index % iconsPerCol;

    return {
      ...app,
      position: {
        x: marginX + (col * iconWidth),
        y: marginY + (row * iconHeight)
      }
    };
  });
};

  // --- CARGA INICIAL Y REDIMENSIONAMIENTO ---
  useEffect(() => {
    const loadEverything = async () => {
      // 1. Calculamos apps de sistema según la resolución actual
      const positionedSystemApps = calculateSystemPositions();

      // 2. Cargar items del usuario desde el Backend
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      try {
        // Limpiamos espacios o caracteres raros
         const cleanRemoteId = remoteId ? remoteId.trim() : null;
         
         // Construimos la URL con cuidado
         // Si hay ID remoto, usamos ?remoteUserId=... sino cadena vacía
         const queryString = cleanRemoteId ? `?remoteUserId=${cleanRemoteId}` : '';
         
         // Eliminamos posible doble slash si backendUrl termina en /
         const baseUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
         const finalUrl = `${baseUrl}/desktop${queryString}`;

         console.log("🚀 Enviando petición a:", finalUrl);

         const data = await fetchDataBackend(
            finalUrl, 
            null, 
            "GET", 
            { Authorization: `Bearer ${token}` }
         );

        if (data && data.ok) {
          const userItems = data.items.map(item => ({
             _id: item._id,
             nombre: item.name,
             imgSrc: getIconImage(item.type),
             type: item.type,
             url: item.url,
             position: item.position,
             content: item.content || ""
           }));

          // Mezclamos: Apps de sistema calculadas + Items de usuario
          setIcons([...positionedSystemApps, ...userItems]);
        }
      } catch (error) {
        setIcons(positionedSystemApps); // Si falla el fetch, al menos mostramos sistema
      }
    };

    loadEverything();

    // --- AQUÍ EMPIEZA LA LÓGICA NUEVA DE WEB SOCKETS ---
    if (socket) {

      if (isRemote) {
            console.log("🔭 Modo Remoto: Conectando a sala de", remoteUserId);
            socket.emit('join-user-room', remoteUserId);
        }
      
      // A. Escuchar cuando se CREA un ítem (por otro usuario o por mí en otra pestaña)
      socket.on('item-created', (newItem) => {
        console.log("📡 Socket: item-created", newItem);
        
        // Formateamos el ítem que llega del socket para que coincida con nuestra UI
        const newIconUI = {
            _id: newItem._id,
            nombre: newItem.name,
            imgSrc: getIconImage(newItem.type),
            type: newItem.type,
            url: newItem.url,
            position: newItem.position || { x: 100, y: 100 },
            content: newItem.content || ""
        };

        // Lo agregamos al estado si no existe ya
        setIcons(prev => {
            if (prev.find(i => i._id === newItem._id)) return prev;
            return [...prev, newIconUI];
        });
      });

      // B. Escuchar cuando se MUEVE un ítem
      socket.on('item-moved', ({ id, position }) => {
        console.log("📡 Socket: item-moved", id, position);
        setIcons(prev => prev.map(icon => 
            icon._id === id ? { ...icon, position } : icon
        ));
      });

      // C. Escuchar cuando se RENOMBRA un ítem
      socket.on('item-renamed', ({ id, name }) => {
         console.log("📡 Socket: item-renamed", id, name);
         setIcons(prev => prev.map(icon => 
            icon._id === id ? { ...icon, nombre: name } : icon
         ));
      });

      // D. Escuchar cuando se ELIMINA un ítem (o varios)
      socket.on('item-deleted', ({ ids }) => {
        console.log("📡 Socket: item-deleted", ids);
        // Filtramos fuera los iconos que estén en la lista de IDs eliminados
        setIcons(prev => prev.filter(icon => !ids.includes(icon._id)));
      });

      // E. Escuchar cuando alguien me comparte algo
      socket.on('item-shared', (sharedItem) => {
        console.log("🎁 ¡Me compartieron algo!", sharedItem);
        toast.info(`Te han compartido: ${sharedItem.name}`);

        // Lo formateamos para la UI
        const newIconUI = {
            _id: sharedItem._id,
            nombre: sharedItem.name,
            imgSrc: getIconImage(sharedItem.type),
            type: sharedItem.type,
            url: sharedItem.url,
            position: { x: 50, y: 50 }, // Lo ponemos en la esquina por defecto
            content: sharedItem.content || "",
            // Podrías añadir un flag visual para saber que es compartido
            isShared: true 
        };

        setIcons(prev => {
             // Evitar duplicados
             if (prev.find(i => i._id === sharedItem._id)) return prev;
             return [...prev, newIconUI];
        });
      });

      // F. Escuchar cambios de preferencias (Tema/Fondo)
        socket.on('preferences-updated', (prefs) => {
            console.log("🎨 Preferencias actualizadas remotamente:", prefs);
            if (prefs.wallpaperUrl) {
                setCurrentWallpaper(prefs.wallpaperUrl);
            }
            // Si quieres manejar el tema oscuro aquí también:
            // if (prefs.theme) ...
        });

      socket.on('file-change', ({ fileId, content }) => {
        // Buscamos el ícono y le actualizamos su contenido interno
        setIcons(prev => prev.map(icon => 
            icon._id === fileId ? { ...icon, content: content } : icon
        ));
      });


    }

    

    // Opcional: Recalcular si el usuario cambia el tamaño de la ventana
    const handleResize = () => {
      setIcons(prev => {
        const systemUpdated = calculateSystemPositions();
        const userOnes = prev.filter(i => !i._id.toString().startsWith('sys-'));
        return [...systemUpdated, ...userOnes];
      });
    };

    window.addEventListener('resize', handleResize);

    // Limpieza de eventos al desmontar
    return () => {
       window.removeEventListener('resize', () => {}); // Tu resize existente
       
       if (socket && isRemote) {
             const myUser = JSON.parse(localStorage.getItem('user'));
             socket.emit('join-user-room', myUser.id); // Volver a mi sala
        }
       
       if (socket) {
         socket.off('item-created');
         socket.off('item-moved');
         socket.off('item-renamed');
         socket.off('item-deleted');
         socket.off('item-shared');
         socket.off('file-change');
       }
    };

  }, [socket, remoteUserId]);

  // 2. USE EFFECT PARA CARGAR PREFERENCIAS Y ESCUCHAR CAMBIOS
  useEffect(() => {
     const token = localStorage.getItem('token');
     const backendUrl = import.meta.env.VITE_BACKEND_URL;

     // A) Cargar fondo inicial desde perfil
     const fetchWallpaper = async () => {
        try {
            const data = await fetchDataBackend(`${backendUrl}/estudiante/perfil`, null, "GET", { Authorization: `Bearer ${token}` });
            if (data && data.preferences && data.preferences.wallpaperUrl) {
                setCurrentWallpaper(data.preferences.wallpaperUrl);
            }
        } catch (e) { console.error(e); }
     };
     fetchWallpaper();

     // B) Escuchar evento personalizado desde SettingsApp
     const handleWallpaperChange = (e) => {
         if (e.detail) setCurrentWallpaper(e.detail);
     };
     window.addEventListener('wallpaper-changed', handleWallpaperChange);

     const handleLocalUpdate = (e) => {
          const { id, content } = e.detail;
          console.log("🔄 Actualizando escritorio localmente:", id);
          
          setIcons(prev => prev.map(icon => 
              icon._id === id ? { ...icon, content: content } : icon
          ));
      };

      window.addEventListener('local-file-update', handleLocalUpdate);

     return () => {
         window.removeEventListener('wallpaper-changed', handleWallpaperChange);
         window.removeEventListener('local-file-update', handleLocalUpdate);
     };
  }, []);

  // --- NUEVA FUNCIÓN: Persistir movimiento en Backend ---
  const handleMoveIcon = async (id, x, y) => {
  if (id.toString().startsWith('sys-')) return;

  // Ajustado al nuevo tamaño reducido
  const ICON_WIDTH = 74;  
  const ICON_HEIGHT = 88; 

  let finalX = x;
  let finalY = y;

  let isOccupied = true;
  let safetyNet = 0;

  while (isOccupied && safetyNet < 100) {
    const collision = icons.find(icon => {
      if (icon._id === id) return false;
      
      const otherX = icon.position?.x || 0;
      const otherY = icon.position?.y || 0;

      // Colisión AABB ajustada al nuevo tamaño
      return (
        finalX < otherX + ICON_WIDTH &&
        finalX + ICON_WIDTH > otherX &&
        finalY < otherY + ICON_HEIGHT &&
        finalY + ICON_HEIGHT > otherY
      );
    });

    if (collision) {
      finalX += 15; // Desplazamiento menor para mayor precisión
      if (finalX + ICON_WIDTH > window.innerWidth - 10) {
        finalX = 10;
        finalY += 15;
      }
      safetyNet++;
    } else {
      isOccupied = false;
    }
  }

  // Actualización optimista (Sin LAG)
  setIcons(prev => prev.map(icon => 
    icon._id === id ? { ...icon, position: { x: finalX, y: finalY } } : icon
  ));

  const token = localStorage.getItem('token');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  try {
    // Sincronización con Backend (Persiste el orden y posición)
    await fetchDataBackend(
      `${backendUrl}/items/${id}/mover`,
      { x: finalX, y: finalY },
      "PATCH",
      { Authorization: `Bearer ${token}` }
    );
  } catch (error) {
    console.error("Error al persistir posición:", error);
  }
};

    const handleRenameIcon = async (id, name) => {
    // Evitamos renombrar apps del sistema
    if (id.toString().startsWith('sys-')) return;

    const token = localStorage.getItem('token');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      // Según tu Backend: router.patch('/items/:id/renombrar', ...)
      const response = await fetchDataBackend(
        `${backendUrl}/items/${id}/renombrar`,
        { name }, // Enviamos el nuevo nombre en el body
        "PATCH",
        { Authorization: `Bearer ${token}` }
      );

      if (response && response.ok) {
        // Actualizamos el estado local para que el cambio sea visible
        setIcons(prev => prev.map(icon => 
          icon._id === id ? { ...icon, nombre: name } : icon
        ));
      }
    } catch (error) {
      console.error("❌ Error al renombrar el ícono:", error);
    }
  };

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
    setModalMode('link');
    setIsModalVisible(true); // Abre el modal
  };

  const handleOpenNewFolderModal = () => {
    handleCloseMenu();
    setModalMode('folder'); // Modo Carpeta
    setIsModalVisible(true);
  };

  // <-- NUEVO: Cierra el Modal
  const closeModal = () => {
    setIsModalVisible(false);
    setModalMode(null); // Reseteamos modo
  };

  // <-- NUEVO: Lógica para SB-F-004 (Crear ícono y actualizar UI)
  // REMPLAZADO
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
  // FIN REMPLAZO

  const handleCreateItem = async (formData) => {
    const token = localStorage.getItem('token');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Determinamos el tipo según el modo del modal
    const itemType = modalMode === 'link' ? 'link' : 'folder';

    // Preparamos datos para el Backend (Endpoint: POST /items)
    const newItemData = {
        type: itemType,
        name: formData.name,
        url: formData.url || null, // Solo si es link
        x: 100, // Podrías usar Math.random() para variar la posición
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
            // const createdItem = response.item;
            
            // Formateamos para el UI
            // const newIconUI = {
            //     _id: createdItem._id,
            //     nombre: createdItem.name,
            //     imgSrc: getIconImage(createdItem.type), // Usa tu helper existente
            //     type: createdItem.type,
            //     url: createdItem.url,
            //     windowOptions: { defaultWidth: 500, defaultHeight: 400 } // Opcional
            // };

            // setIcons(prev => [...prev, newIconUI]);
            closeModal();
            toast.success(itemType === 'folder' ? "Carpeta creada" : "Enlace creado");
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
  const renderAppContent = (appId, data) => {
    switch (appId) {

      case 'folder': // <--- NUEVO CASO PARA CARPETAS
        return (
          <FolderContent 
            folderId={data?._id} 
            folderName={data?.nombre} 
          />
        );

      case 'notepad':
      case 'note': 
        return (
          <WordEditor 
            fileId={data?._id} 
            fileName={data?.nombre}
            initialContent={data?.content} // El backend lo envía si el endpoint está bien
          />
        );
      
      case 'code': 
        return (
          <CodeEditor 
            fileId={data?._id} 
            fileName={data?.nombre}
            initialContent={data?.content} 
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
      
      case 'ai-recommendations': // <--- NUEVO CASE
       return <RecommendationsWidget />;

      case 'settings':
        return <SettingsApp />;

      case 'ai-chat':
        return <ChatWidget />;

      default:
        return <div className="text-white p-4">App no encontrada</div>;
      }

  };

  const handleCreateQuickNote = async () => {
    handleCloseMenu(); // Cerramos el menú
    
    const token = localStorage.getItem('token');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Usamos las coordenadas del menú contextual (donde hiciste clic)
    // O un default si no están disponibles
    const posX = menuState.x > 0 ? menuState.x - 50 : 100;
    const posY = menuState.y > 0 ? menuState.y - 50 : 100;

    const newItemData = {
        type: 'note',        // Tipo Nota
        name: 'Nueva Nota',  // Nombre por defecto
        url: null,
        x: posX,
        y: posY
    };

    try {
        const response = await fetchDataBackend(
            `${backendUrl}/items`,
            newItemData,
            "POST",
            { Authorization: `Bearer ${token}` }
        );

        if (response && response.ok) {
            // const createdItem = response.item;
            
            // Creamos el objeto para la UI
            // const newIconUI = {
            //     _id: createdItem._id,
            //     nombre: createdItem.name,
            //     imgSrc: getIconImage('note'), // Asegúrate que 'note' devuelva tu icono de nota
            //     type: 'note',
            //     url: null,
            //     content: "", // Contenido vacío al inicio
            //     position: { x: posX, y: posY }
            // };

            // setIcons(prev => [...prev, newIconUI]);
            toast.success("Nota creada. Haz clic en el nombre para renombrar.");
        }
    } catch (error) {
        console.error("Error creando nota rápida:", error);
    }
  };

  // --- NUEVA FUNCIÓN: CREAR ARCHIVO DE CÓDIGO ---
  const handleCreateQuickCode = async () => {
    handleCloseMenu();
    
    const token = localStorage.getItem('token');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Posición donde hiciste clic
    const posX = menuState.x > 0 ? menuState.x - 50 : 120;
    const posY = menuState.y > 0 ? menuState.y - 50 : 120;

    const newItemData = {
        type: 'code',           // <--- TIPO CODE
        name: 'script.js',      // Nombre por defecto
        url: null,
        x: posX,
        y: posY
    };

    try {
        const response = await fetchDataBackend(
            `${backendUrl}/items`,
            newItemData,
            "POST",
            { Authorization: `Bearer ${token}` }
        );

        if (response && response.ok) {
            // const createdItem = response.item;
            
            // const newIconUI = {
            //     _id: createdItem._id,
            //     nombre: createdItem.name,
            //     imgSrc: getIconImage('code'), // Usará el ícono de código
            //     type: 'code',
            //     url: null,
            //     content: "", 
            //     position: { x: posX, y: posY }
            // };

            // setIcons(prev => [...prev, newIconUI]);
            toast.success("Archivo de código creado.");
        }
    } catch (error) {
        console.error("Error creando código:", error);
    }
  };

  // 2. FUNCIÓN PARA ABRIR MODAL DE COMPARTIR
  const handleOpenShareModal = () => {
    // Verificamos que sea un item del usuario (no de sistema)
    if (menuState.selectedItem && !menuState.selectedItem._id.toString().startsWith('sys-')) {
        handleCloseMenu();
        setModalMode('share'); // Modo Compartir
        setIsModalVisible(true);
    } else {
        toast.error("No puedes compartir este elemento.");
        handleCloseMenu();
    }
  };

  // 3. FUNCIÓN PARA LLAMAR AL BACKEND (POST /share/:id)
  const handleShareItem = async (formData) => {
    const token = localStorage.getItem('token');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const itemId = menuState.selectedItem._id; // El item que seleccionamos con click derecho

    try {
        const response = await fetchDataBackend(
            `${backendUrl}/share/${itemId}`, // Endpoint memorizado
            { email: formData.email, permission: formData.permission },
            "POST",
            { Authorization: `Bearer ${token}` }
        );

        if (response && response.ok) {
            toast.success(`Invitación enviada a ${formData.email}`);
            closeModal();
        }
    } catch (error) {
        console.error("Error al compartir:", error);
    }
  };


  return (
    <div className="w-full h-screen overflow-hidden" onContextMenu={handleContextMenu} onClick={handleCloseMenu}>
      
      {/* Fondo */}
      <div className="fixed inset-0 -z-10" 
            style={{ 
                backgroundImage: `url(${currentWallpaper})`, // <--- USAR ESTADO
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                transition: 'background-image 0.5s ease-in-out' // Efecto suave
            }} 
       />

      {/* BARRA DE AVISO (Solo si es remoto) */}
      {/* BARRA DE AVISO (Solo si es remoto) */}
      {isRemote && (
        <div className="fixed top-0 left-0 right-0 h-8 bg-red-600 z-[100] flex items-center justify-center text-white text-xs font-bold shadow-lg">
            VISUALIZANDO ESCRITORIO DE: {remoteUserName?.toUpperCase()} (Modo Espectador)
        </div>
      )}

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
            onMove={handleMoveIcon}
            onRename={handleRenameIcon}
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
        onNewFolder={handleOpenNewFolderModal}
        onNewNote={handleCreateQuickNote}
        onNewCode={handleCreateQuickCode}
        onDelete={handleDeleteItem}
        onShare={handleOpenShareModal}
      />

      <Modal 
        isVisible={isModalVisible} 
        onClose={closeModal} 
        title={
            modalMode === 'folder' ? "Nueva Carpeta" : 
            modalMode === 'link' ? "Nuevo Enlace Web" : 
            modalMode === 'share' ? "Compartir Elemento" : "" // <--- Título dinámico
        }
      >
        {modalMode === 'folder' && <NewFolderForm onSubmit={handleCreateItem} />}
        {modalMode === 'link' && <NewLinkForm onSubmit={handleCreateItem} />}
        
        {/* Renderizamos el formulario de compartir */}
        {modalMode === 'share' && (
            <ShareForm 
                onSubmit={handleShareItem} 
                itemToShare={menuState.selectedItem} 
            />
        )}
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
                id={win.id}
                onDragStop={onDragStop}
              >
                {renderAppContent(win.appId, win.data)}
              </AppWindow>
            </div>
        ))}
      </div>
    </div>
  );
}

export default Desktop;