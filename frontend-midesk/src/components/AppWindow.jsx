// src/components/AppWindow.jsx
import React, { useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';

function AppWindow({ 
  id, 
  title, 
  children, 
  onClose, 
  onMinimize, 
  onMaximize, 
  onDragStop, 
  zIndex, 
  onFocus, 
  defaultWidth = 640, 
  defaultHeight = 400, 
  defaultX = 50, 
  defaultY = 50, 
  isMaximized, 
  isActive 
}) {

  const rndRef = useRef(null);

  // Guardamos el tamaño/posición ANTES de maximizar para restaurarlo después
  const snapshot = useRef({ x: defaultX, y: defaultY, width: defaultWidth, height: defaultHeight });

  // ── Cuando cambia isMaximized, forzamos posición/tamaño en la instancia de Rnd ──
  useEffect(() => {
    if (!rndRef.current) return;

    if (isMaximized) {
      rndRef.current.updatePosition({ x: 0, y: 0 });
      rndRef.current.updateSize({ width: window.innerWidth, height: window.innerHeight - 48 });
    } else {
      // Restaurar al snapshot guardado
      rndRef.current.updatePosition({ x: snapshot.current.x, y: snapshot.current.y });
      rndRef.current.updateSize({ width: snapshot.current.width, height: snapshot.current.height });
    }
  }, [isMaximized]);

  // ── Guardar snapshot cada vez que el usuario mueve o redimensiona ──
  const saveSnapshot = (x, y, w, h) => {
    snapshot.current = { x, y, width: w, height: h };
  };

  return (
    <Rnd
      ref={rndRef}
      className="pointer-events-auto"
      disableDragging={isMaximized}
      enableResizing={!isMaximized}

      // Estado inicial (solo se usa al montar)
      default={{
        x: defaultX,
        y: defaultY,
        width: defaultWidth,
        height: defaultHeight,
      }}

      minWidth={320}
      minHeight={220}

      dragHandleClassName="window-titlebar"

      style={{ zIndex }}

      onMouseDown={() => onFocus?.()}

      onDragStop={(e, d) => {
        if (isMaximized) return;
        onFocus?.();
        saveSnapshot(d.x, d.y, d.width, d.height);
        onDragStop?.(id, d.x, d.y);
      }}

      onResizeStop={(e, dir, ref, delta, pos) => {
        if (isMaximized) return;
        const w = parseInt(ref.style.width, 10);
        const h = parseInt(ref.style.height, 10);
        saveSnapshot(pos.x, pos.y, w, h);
      }}
    >
      {/* ─── SHELL ─── */}
      <div
        style={{ height: '100%', width: '100%' }}
        className={[
          'flex flex-col',
          'bg-[#1e1e2e]/95 backdrop-blur-xl',
          isMaximized ? 'rounded-none' : 'rounded-xl',
          'shadow-[0_8px_40px_rgba(0,0,0,0.55)]',
          'border border-white/10',
          'text-white overflow-hidden',
          'pointer-events-auto',
        ].join(' ')}
      >

        {/* ─── TITLEBAR ─── */}
        <div
          className="window-titlebar relative h-10 flex items-center bg-white/[0.04] border-b border-white/[0.07] select-none cursor-default shrink-0"
          onDoubleClick={onMaximize}
        >
          {/* Botones semáforo */}
          <div className="flex items-center gap-[5px] pl-3.5 group">
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="w-3.5 h-3.5 rounded-full bg-[#FF5F57] hover:brightness-110 active:brightness-90 flex items-center justify-center transition-all duration-150"
            >
              <X size={8} strokeWidth={2.5} className="text-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={onMinimize}
              aria-label="Minimizar"
              className="w-3.5 h-3.5 rounded-full bg-[#FEBC2E] hover:brightness-110 active:brightness-90 flex items-center justify-center transition-all duration-150"
            >
              <Minus size={8} strokeWidth={2.8} className="text-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={onMaximize}
              aria-label={isMaximized ? 'Restaurar' : 'Maximizar'}
              className="w-3.5 h-3.5 rounded-full bg-[#28C840] hover:brightness-110 active:brightness-90 flex items-center justify-center transition-all duration-150"
            >
              {isMaximized
                ? <Minimize2 size={8} strokeWidth={2.5} className="text-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                : <Maximize2 size={8} strokeWidth={2.5} className="text-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              }
            </button>
          </div>

          {/* Título centrado absolutamente */}
          <span className="absolute inset-x-0 text-center text-xs font-medium text-gray-400 tracking-wide pointer-events-none">
            {title}
          </span>

          <div className="ml-auto w-14 shrink-0" />
        </div>

        {/* ─── CONTENIDO ─── */}
        <div className="flex-1 min-h-0 w-full overflow-hidden relative">
          {children}
        </div>

        {/* ─── GRIP resize ─── */}
        {!isMaximized && (
          <div className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none">
            <svg viewBox="0 0 12 12" className="w-full h-full" style={{ display: 'block' }}>
              <line x1="11" y1="3"  x2="3"  y2="11" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeLinecap="round" />
              <line x1="11" y1="6"  x2="6"  y2="11" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeLinecap="round" />
              <line x1="11" y1="9"  x2="9"  y2="11" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
        )}

      </div>
    </Rnd>
  );
}

export default AppWindow;