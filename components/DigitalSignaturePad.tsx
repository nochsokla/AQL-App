/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, PenTool, ShieldCheck, Download } from 'lucide-react';

interface DigitalSignaturePadProps {
  signerName: string;
  roleTitle: string;
  signatureDataUrl?: string | null;
  onSaveSignature: (dataUrl: string | null) => void;
  dateStr: string;
}

export const DigitalSignaturePad: React.FC<DigitalSignaturePadProps> = ({
  signerName,
  roleTitle,
  signatureDataUrl,
  onSaveSignature,
  dateStr,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(Boolean(signatureDataUrl));
  const [signedTimestamp, setSignedTimestamp] = useState<string | null>(
    signatureDataUrl ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
  );

  // Set up canvas with DPI scaling
  const setupCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width > 0 ? rect.width : 340;
    const height = 140;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#0F172A'; // Slate-900

      // If existing signature exists, restore it onto the canvas
      if (signatureDataUrl) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          setHasDrawn(true);
        };
        img.src = signatureDataUrl;
      }
    }
  };

  useEffect(() => {
    setupCanvas();

    const handleResize = () => {
      // Re-setup if resized without losing current signature
      if (!isDrawing) {
        setupCanvas();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Coordinate calculation relative to canvas
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    const { x, y } = getCoordinates(e);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
      setHasDrawn(true);
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCoordinates(e);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {}

    setIsDrawing(false);

    // Save signature as high-res PNG
    const dataUrl = canvas.toDataURL('image/png');
    onSaveSignature(dataUrl);
    setSignedTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawn(false);
    setSignedTimestamp(null);
    onSaveSignature(null);
  };

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
          <PenTool className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>{roleTitle}:</span>
          <strong className="text-slate-900 dark:text-white">{signerName || 'Inspector'}</strong>
        </div>

        {hasDrawn && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 no-print transition-colors cursor-pointer"
            title="Clear and re-sign"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* HTML5 Canvas Signature Area */}
      <div
        ref={containerRef}
        className="relative bg-white rounded-lg border border-slate-300 dark:border-slate-600 shadow-2xs overflow-hidden transition-all focus-within:border-sky-500"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          style={{ touchAction: 'none' }}
          className="w-full h-[140px] cursor-crosshair block select-none bg-white"
        />

        {/* Signing Guide Line Overlay */}
        <div className="absolute bottom-7 left-5 right-5 pointer-events-none flex items-center">
          <span className="text-slate-300 font-mono text-[11px] mr-2 select-none">✕</span>
          <div className="flex-1 border-b border-slate-300/80 border-dashed" />
        </div>

        {/* Guidance Prompt (when empty) */}
        {!hasDrawn && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <span className="text-[11px] text-slate-400 font-sans tracking-wide">
              Sign directly on the device using touch, stylus, or mouse
            </span>
          </div>
        )}

        {/* Verified Badge (when signed) */}
        {hasDrawn && (
          <div className="absolute top-2 right-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 shadow-2xs no-print">
            <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Signed</span>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
        <span>Date: {dateStr}</span>
        {signedTimestamp ? (
          <span className="font-mono text-slate-600 dark:text-slate-300">
            Digitally Captured at {signedTimestamp}
          </span>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 italic">Signature required for final FRI sign-off</span>
        )}
      </div>
    </div>
  );
};
