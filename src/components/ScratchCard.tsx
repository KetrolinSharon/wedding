/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { Eye, Sparkles } from 'lucide-react';

interface ScratchCardProps {
  label: string; // e.g. "DAY", "MONTH", "YEAR"
  revealValue: string; // e.g. "29", "June", "2026"
  subText: string; // e.g. "Monday", "The Month", "The Year"
  onReveal?: () => void;
}

export default function ScratchCard({ label, revealValue, subText, onReveal }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI screens safely
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 128;
    const height = rect.height || 128;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Initial canvas style - Champagne gold foil effect
    // Create glittering gold gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#B76E79'); // Rose gold
    gradient.addColorStop(0.3, '#FDFBF7'); // Ivory highlight
    gradient.addColorStop(0.5, '#F7E7CE'); // Champagne gold
    gradient.addColorStop(0.7, '#E8DDD4'); // Warm beige
    gradient.addColorStop(1, '#B76E79'); // Rose gold

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw some subtle decorative circles/leaf veins on the foil
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(4, 4, width - 8, height - 8);

    ctx.strokeStyle = 'rgba(183, 110, 121, 0.2)';
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, Math.min(width, height) / 3, 0, Math.PI * 2);
    ctx.stroke();

    // Draw decorative gold monogram text
    ctx.fillStyle = '#443A24';
    ctx.font = 'normal 13px "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, width / 2, height / 2 - 8);

    ctx.fillStyle = '#B76E79';
    ctx.font = 'italic 11px "Great Vibes", cursive';
    ctx.fillText('Scratch here', width / 2, height / 2 + 12);

    // Save initial pixel state to compute percentage
    const checkScratchPercentage = () => {
      try {
        const checkW = Math.floor(canvas.width);
        const checkH = Math.floor(canvas.height);
        if (checkW <= 0 || checkH <= 0) return;

        const imgData = ctx.getImageData(0, 0, checkW, checkH);
        const pixels = imgData.data;
        let transparentPixels = 0;

        // Sample every 4th pixel for speed
        for (let i = 3; i < pixels.length; i += 16) {
          if (pixels[i] === 0) {
            transparentPixels++;
          }
        }

        const totalSamples = pixels.length / 16;
        const percent = Math.round((transparentPixels / totalSamples) * 100);
        setScratchPercent(percent);

        if (percent > 45) {
          setIsScratched(true);
          onReveal?.();
        }
      } catch (e) {
        // Cross-origin issues fallback
      }
    };

    const getCoordinates = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fill();
      checkScratchPercentage();
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      setIsDrawing(true);
      const coords = getCoordinates(e);
      scratch(coords.x, coords.y);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      const coords = getCoordinates(e);
      scratch(coords.x, coords.y);
    };

    const handleEnd = () => {
      setIsDrawing(false);
    };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);

    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchend', handleEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('mouseleave', handleEnd);

      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleEnd);
    };
  }, [label]);

  // Fast auto reveal
  const handleAutoReveal = () => {
    setIsScratched(true);
    onReveal?.();
  };

  return (
    <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-xl flex flex-col items-center justify-center bg-pearl border border-beige/60 overflow-hidden luxury-card-shadow transition-all duration-500 hover:scale-[1.03]">
      {/* Background Revealed Value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 select-none">
        <span className="text-3xl md:text-4xl font-serif font-bold text-primary tracking-tight">
          {revealValue}
        </span>
        <span className="text-[10px] md:text-xs font-sans tracking-widest uppercase text-charcoal/60 mt-1">
          {subText}
        </span>
        <Sparkles className="absolute top-2 right-2 w-3 h-3 text-gold/50 animate-pulse" />
      </div>

      {/* Front Scratch Foil Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-700 ${
          isScratched ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ touchAction: 'none' }}
      />

      {/* Quick Interactive helper eye icon for guests to tap-reveal if they prefer */}
      {!isScratched && (
        <button
          onClick={handleAutoReveal}
          className="absolute bottom-1 right-1 p-1 bg-white/90 hover:bg-white text-primary rounded-full shadow-xs text-[9px] flex items-center gap-0.5 transform scale-75 cursor-pointer"
          title="Instant Reveal"
        >
          <Eye className="w-2.5 h-2.5" />
          <span>Reveal</span>
        </button>
      )}
    </div>
  );
}
