import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { Monitor, Upload, Check, Moon, Sun, Globe, RefreshCw, Loader, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';

// IMPORTANTE: Asegúrate de importar tu fondo por defecto aquí
import defaultWallpaperImg from '../../assets/wallpapers/mi-fondo.jpg';

const SettingsApp = () => {
  const [activeTab, setActiveTab] = useState('appearance'); 
  const [theme, setTheme] = useState('light');
  const [currentWallpaper, setCurrentWallpaper] = useState(null);
  
  // Unsplash States
  const [unsplashImages, setUnsplashImages] = useState([]);
  const [loadingUnsplash, setLoadingUnsplash] = useState(false);
  const [unsplashQuery, setUnsplashQuery] = useState('nature');

  const fetchDataBackend = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const unsplashKey = import.meta.env.VITE_UNSPLASH_API_KEY;
  const token = localStorage.getItem('token');

  // Cargar preferencias iniciales
  useEffect(() => {
    const loadPrefs = async () => {
        const data = await fetchDataBackend(`${backendUrl}/estudiante/perfil`, null, "GET", { Authorization: `Bearer ${token}` });
        if (data && data.preferences) {
            setTheme(data.preferences.theme || 'light');
            setCurrentWallpaper(data.preferences.wallpaperUrl); // Si es null, el Desktop usará el default
        }
    };
    loadPrefs();
  }, []);

  // Función Guardar Preferencias
  const savePreferences = async (updates) => {
    // updates: { wallpaperUrl: "..." } o { wallpaperUrl: "" } para resetear

    await fetchDataBackend(
        `${backendUrl}/user/preferences`,
        updates,
        "PATCH",
        { Authorization: `Bearer ${token}` }
    );

    // Actualizar estado local
    if (updates.theme) setTheme(updates.theme);
    
    // Si actualizamos wallpaper
    if (updates.wallpaperUrl !== undefined) {
        setCurrentWallpaper(updates.wallpaperUrl);
        
        // Notificamos al escritorio inmediatamente
        // Si es vacío (""), enviamos la imagen local importada para que se vea ya
        const bgToSend = updates.wallpaperUrl === "" ? defaultWallpaperImg : updates.wallpaperUrl;
        
        window.dispatchEvent(new CustomEvent('wallpaper-changed', { detail: bgToSend }));
        toast.success(updates.wallpaperUrl === "" ? "Fondo restaurado" : "Fondo aplicado");
    }
  };

  // Función para restaurar fondo original
  const handleResetWallpaper = () => {
      // Enviamos cadena vacía para que el backend limpie la URL
      savePreferences({ wallpaperUrl: "" });
  };

  // Unsplash Fetch (Igual que tenías)
  const fetchUnsplashPhotos = async (query = 'nature') => {
    if (!unsplashKey) { toast.error("Falta API Key Unsplash"); return; }
    setLoadingUnsplash(true);
    setUnsplashQuery(query);
    try {
        const url = `https://api.unsplash.com/photos/random?count=6&query=${query}&orientation=landscape&client_id=${unsplashKey}`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) setUnsplashImages(data);
    } catch (error) { console.error(error); } 
    finally { setLoadingUnsplash(false); }
  };

  useEffect(() => {
      if (activeTab === 'unsplash' && unsplashImages.length === 0) fetchUnsplashPhotos();
  }, [activeTab]);

  // Subida de imagen (Igual que tenías)
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
            toast.update(toastId, { render: "Imagen subida", type: "success", isLoading: false, autoClose: 2000 });
            setCurrentWallpaper(data.wallpaperUrl);
            window.dispatchEvent(new CustomEvent('wallpaper-changed', { detail: data.wallpaperUrl }));
        } else {
            toast.update(toastId, { render: "Error subiendo", type: "error", isLoading: false, autoClose: 3000 });
        }
    } catch (error) { toast.update(toastId, { render: "Error de conexión", type: "error", isLoading: false, autoClose: 3000 }); }
  };

  return (
    <div className="flex h-full bg-[#1e1e2e] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-48 bg-black/20 border-r border-white/10 p-2 space-y-1 flex flex-col">
        <button onClick={() => setActiveTab('appearance')} className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 text-sm transition-colors ${activeTab === 'appearance' ? 'bg-purple-600/80 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
            <Monitor size={16} /> Apariencia
        </button>
        <button onClick={() => setActiveTab('unsplash')} className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 text-sm transition-colors ${activeTab === 'unsplash' ? 'bg-purple-600/80 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
            <Globe size={16} /> Galería Online
        </button>
        <button onClick={() => setActiveTab('upload')} className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 text-sm transition-colors ${activeTab === 'upload' ? 'bg-purple-600/80 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
            <Upload size={16} /> Subir Propia
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        
        {/* PESTAÑA APARIENCIA */}
        {activeTab === 'appearance' && (
            <div className="space-y-8 animate-fade-in-up">
                
                {/* Sección Tema */}
                <div>
                    <h2 className="text-lg font-bold border-b border-white/10 pb-2 mb-4">Tema del Sistema</h2>
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                        <div onClick={() => savePreferences({ theme: 'light' })} className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'border-purple-500 bg-white/10' : 'border-white/5 hover:bg-white/10'}`}>
                            <Sun size={32} className="text-yellow-400" />
                            <span className="font-medium text-sm">Modo Claro</span>
                        </div>
                        <div onClick={() => savePreferences({ theme: 'dark' })} className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'border-purple-500 bg-white/10' : 'border-white/5 hover:bg-white/10'}`}>
                            <Moon size={32} className="text-blue-400" />
                            <span className="font-medium text-sm">Modo Oscuro</span>
                        </div>
                    </div>
                </div>

                {/* NUEVA SECCIÓN: Restablecer Fondo */}
                <div>
                    <h2 className="text-lg font-bold border-b border-white/10 pb-2 mb-4">Fondo de Pantalla</h2>
                    <div className="flex items-start gap-4">
                        {/* Vista previa del fondo por defecto */}
                        <div className="relative w-40 aspect-video rounded-lg overflow-hidden border border-white/20 group cursor-pointer" onClick={handleResetWallpaper}>
                            <img src={defaultWallpaperImg} alt="Default" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-transparent transition-colors">
                                <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">Original</span>
                            </div>
                            {/* Check si está activo (si currentWallpaper es null o vacío) */}
                            {(!currentWallpaper || currentWallpaper === "") && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow">
                                    <Check size={12} />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-gray-400">¿Te cansaste de las fotos de internet?</p>
                            <button 
                                onClick={handleResetWallpaper}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors w-fit"
                            >
                                <RotateCcw size={16} /> Restaurar Predeterminado
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        )}

        {/* PESTAÑA UNSPLASH (Igual) */}
        {activeTab === 'unsplash' && (
            <div className="space-y-4 animate-fade-in-up h-full flex flex-col">
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                    <h2 className="text-xl font-bold">Fondos Dinámicos</h2>
                    <div className="flex gap-2 text-xs">
                        {['nature', 'technology', 'cyberpunk', 'architecture'].map(cat => (
                            <button key={cat} onClick={() => fetchUnsplashPhotos(cat)} className={`px-3 py-1 rounded-full border capitalize ${unsplashQuery === cat ? 'bg-purple-600 border-purple-500' : 'border-gray-600 hover:border-white'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                {loadingUnsplash ? (
                    <div className="flex-1 flex items-center justify-center"><Loader className="animate-spin text-purple-500" size={40} /></div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {unsplashImages.map((img) => (
                            <div key={img.id} className="group relative aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer border border-transparent hover:border-purple-500 transition-all"
                                onClick={() => savePreferences({ wallpaperUrl: img.urls.regular })}>
                                <img src={img.urls.small} alt={img.alt_description} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">Aplicar</span>
                                </div>
                                {currentWallpaper === img.urls.regular && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-lg"><Check size={12} /></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <button onClick={() => fetchUnsplashPhotos(unsplashQuery)} className="self-center flex items-center gap-2 text-sm text-gray-400 hover:text-white mt-2">
                    <RefreshCw size={14} /> Cargar más
                </button>
            </div>
        )}

        {/* PESTAÑA UPLOAD (Igual) */}
        {activeTab === 'upload' && (
             <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-bold border-b border-white/10 pb-2">Subir Imagen</h2>
                <div className="aspect-video w-full max-w-lg bg-gray-800 rounded-xl overflow-hidden border-2 border-dashed border-gray-600 flex flex-col items-center justify-center relative group hover:border-purple-500 transition-colors">
                    {currentWallpaper && <img src={currentWallpaper} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity" />}
                    <Upload size={48} className="text-gray-400 mb-2 z-10" />
                    <p className="text-gray-300 z-10 font-medium">Click para subir</p>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default SettingsApp;