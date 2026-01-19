import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { Monitor, Image as ImageIcon, Upload, Check, Moon, Sun, Globe, RefreshCw, Loader } from 'lucide-react';
import { toast } from 'react-toastify';

const SettingsApp = () => {
  const [activeTab, setActiveTab] = useState('appearance'); // 'appearance' | 'upload' | 'unsplash'
  const [theme, setTheme] = useState('light');
  const [currentWallpaper, setCurrentWallpaper] = useState(null);
  
  // Estados para Unsplash
  const [unsplashImages, setUnsplashImages] = useState([]);
  const [loadingUnsplash, setLoadingUnsplash] = useState(false);
  const [unsplashQuery, setUnsplashQuery] = useState('nature'); // Categoría por defecto

  const fetchDataBackend = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const unsplashKey = import.meta.env.VITE_UNSPLASH_API_KEY;
  const token = localStorage.getItem('token');

  // 1. Cargar preferencias iniciales
  useEffect(() => {
    const loadPrefs = async () => {
        const data = await fetchDataBackend(`${backendUrl}/estudiante/perfil`, null, "GET", { Authorization: `Bearer ${token}` });
        if (data && data.preferences) {
            setTheme(data.preferences.theme || 'light');
            setCurrentWallpaper(data.preferences.wallpaperUrl);
        }
    };
    loadPrefs();
  }, []);

  // 2. Función para obtener imágenes de Unsplash
  const fetchUnsplashPhotos = async (query = 'nature') => {
    if (!unsplashKey) {
        toast.error("Falta la API Key de Unsplash en .env");
        return;
    }
    setLoadingUnsplash(true);
    setUnsplashQuery(query);
    try {
        // Pedimos 6 fotos aleatorias de la categoría seleccionada
        const url = `https://api.unsplash.com/photos/random?count=6&query=${query}&orientation=landscape&client_id=${unsplashKey}`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (res.ok) {
            setUnsplashImages(data);
        } else {
            console.error("Unsplash Error:", data);
            toast.error("Error al cargar galería");
        }
    } catch (error) {
        console.error(error);
    } finally {
        setLoadingUnsplash(false);
    }
  };

  // Cargar Unsplash la primera vez que se entra a la tab
  useEffect(() => {
      if (activeTab === 'unsplash' && unsplashImages.length === 0) {
          fetchUnsplashPhotos();
      }
  }, [activeTab]);

  // 3. Guardar cambios (Tema o Wallpaper URL)
  const savePreferences = async (updates) => {
    // updates puede ser { theme: '...' } o { wallpaperUrl: '...' }
    
    await fetchDataBackend(
        `${backendUrl}/user/preferences`,
        updates,
        "PATCH",
        { Authorization: `Bearer ${token}` }
    );

    // Actualizar estado local
    if (updates.theme) setTheme(updates.theme);
    if (updates.wallpaperUrl) setCurrentWallpaper(updates.wallpaperUrl);

    // Evento para Desktop.jsx (actualización inmediata sin socket, por si acaso)
    if (updates.wallpaperUrl) {
        window.dispatchEvent(new CustomEvent('wallpaper-changed', { detail: updates.wallpaperUrl }));
        toast.success("Fondo aplicado");
    }
  };

  // 4. Subir imagen propia (FormData)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading("Subiendo imagen...");
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`${backendUrl}/upload/image`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        const data = await response.json();

        if (response.ok) {
            toast.update(toastId, { render: "Imagen subida exitosamente", type: "success", isLoading: false, autoClose: 2000 });
            setCurrentWallpaper(data.wallpaperUrl);
            window.dispatchEvent(new CustomEvent('wallpaper-changed', { detail: data.wallpaperUrl }));
        } else {
            toast.update(toastId, { render: data.msg || "Error", type: "error", isLoading: false, autoClose: 3000 });
        }
    } catch (error) {
        toast.update(toastId, { render: "Error de conexión", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  return (
    <div className="flex h-full bg-[#1e1e2e] text-white font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <div className="w-48 bg-black/20 border-r border-white/10 p-2 space-y-1 flex flex-col">
        <button 
            onClick={() => setActiveTab('appearance')}
            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 text-sm transition-colors ${activeTab === 'appearance' ? 'bg-purple-600/80 text-white' : 'text-gray-400 hover:bg-white/5'}`}
        >
            <Monitor size={16} /> Tema
        </button>
        <button 
            onClick={() => setActiveTab('unsplash')}
            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 text-sm transition-colors ${activeTab === 'unsplash' ? 'bg-purple-600/80 text-white' : 'text-gray-400 hover:bg-white/5'}`}
        >
            <Globe size={16} /> Galería Online
        </button>
        <button 
            onClick={() => setActiveTab('upload')}
            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 text-sm transition-colors ${activeTab === 'upload' ? 'bg-purple-600/80 text-white' : 'text-gray-400 hover:bg-white/5'}`}
        >
            <Upload size={16} /> Subir Propia
        </button>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        
        {/* PESTAÑA: APARIENCIA */}
        {activeTab === 'appearance' && (
            <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-bold border-b border-white/10 pb-2">Apariencia del Sistema</h2>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                    <div 
                        onClick={() => savePreferences({ theme: 'light' })}
                        className={`cursor-pointer border-2 rounded-xl p-6 flex flex-col items-center gap-4 transition-all ${theme === 'light' ? 'border-purple-500 bg-white/10' : 'border-white/5 hover:bg-white/10'}`}
                    >
                        <Sun size={40} className="text-yellow-400" />
                        <span className="font-medium">Modo Claro</span>
                    </div>
                    <div 
                        onClick={() => savePreferences({ theme: 'dark' })}
                        className={`cursor-pointer border-2 rounded-xl p-6 flex flex-col items-center gap-4 transition-all ${theme === 'dark' ? 'border-purple-500 bg-white/10' : 'border-white/5 hover:bg-white/10'}`}
                    >
                        <Moon size={40} className="text-blue-400" />
                        <span className="font-medium">Modo Oscuro</span>
                    </div>
                </div>
            </div>
        )}

        {/* PESTAÑA: GALERÍA ONLINE (UNSPLASH) */}
        {activeTab === 'unsplash' && (
            <div className="space-y-4 animate-fade-in-up h-full flex flex-col">
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                    <h2 className="text-xl font-bold">Fondos Dinámicos</h2>
                    
                    {/* Filtros rápidos */}
                    <div className="flex gap-2 text-xs">
                        {['nature', 'technology', 'cyberpunk', 'architecture'].map(cat => (
                            <button 
                                key={cat}
                                onClick={() => fetchUnsplashPhotos(cat)}
                                className={`px-3 py-1 rounded-full border capitalize ${unsplashQuery === cat ? 'bg-purple-600 border-purple-500' : 'border-gray-600 hover:border-white'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid de Imágenes */}
                {loadingUnsplash ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader className="animate-spin text-purple-500" size={40} />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {unsplashImages.map((img) => (
                            <div 
                                key={img.id} 
                                className="group relative aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer border border-transparent hover:border-purple-500 transition-all"
                                onClick={() => savePreferences({ wallpaperUrl: img.urls.regular })}
                            >
                                <img 
                                    src={img.urls.small} 
                                    alt={img.alt_description} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {/* Overlay al hacer hover */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                        Aplicar Fondo
                                    </span>
                                </div>
                                {/* Icono de "Seleccionado" si coincide con el actual */}
                                {currentWallpaper === img.urls.regular && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                                        <Check size={12} />
                                    </div>
                                )}
                                {/* Créditos */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Por: {img.user.name}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <button 
                    onClick={() => fetchUnsplashPhotos(unsplashQuery)}
                    className="self-center flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mt-2"
                >
                    <RefreshCw size={14} /> Cargar más imágenes
                </button>
            </div>
        )}

        {/* PESTAÑA: SUBIR PROPIA */}
        {activeTab === 'upload' && (
            <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-bold border-b border-white/10 pb-2">Subir Imagen</h2>
                
                <div className="aspect-video w-full max-w-lg bg-gray-800 rounded-xl overflow-hidden border-2 border-dashed border-gray-600 flex flex-col items-center justify-center relative group hover:border-purple-500 transition-colors">
                    {currentWallpaper && (
                        <img src={currentWallpaper} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity" />
                    )}
                    
                    <Upload size={48} className="text-gray-400 mb-2 z-10" />
                    <p className="text-gray-300 z-10 font-medium">Arrastra o haz clic para subir</p>
                    <p className="text-xs text-gray-500 z-10 mt-1">JPG, PNG (Máx 5MB)</p>
                    
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    />
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default SettingsApp;