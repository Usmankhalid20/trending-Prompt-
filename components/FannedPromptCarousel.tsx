'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ── Data Schema ── */
interface PromptCard {
  id: string;
  title: string;
  frameId: string;
  model: string;
  artworkDesc: string;
  prompt: string;
  gradient: string;
  image: string;
}

/* ── 5 Production-Grade Mock Fixtures with Real AI/Editorial Art ── */
const CARDS: PromptCard[] = [
  {
    id: 'pc-001',
    title: 'spatial',
    frameId: '01 // FRAME',
    model: 'MJ v6.0',
    artworkDesc: 'Brutalist Architectural Corridor',
    prompt: '/imagine prompt: brutalist concrete architectural corridor, dramatic overhead chiaroscuro lighting, moody atmospheric shadows, wet reflective floor, monolithic geometry --ar 16:9 --v 6.0 --stylize 850',
    gradient: 'linear-gradient(160deg, #111018 0%, #1e1b29 55%, #0d0c12 100%)',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'pc-002',
    title: 'editorial',
    frameId: '02 // FRAME',
    model: 'DALL·E 3',
    artworkDesc: 'Minimal Editorial Fashion Spread',
    prompt: '/imagine prompt: editorial fashion layout, floating minimal black serif typography cards, textured beige paper layers, studio portrait lighting, ultra clean white background, magazine editorial --ar 3:4',
    gradient: 'linear-gradient(160deg, #1a1622 0%, #3b3247 55%, #120e18 100%)',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'pc-003',
    title: 'digital',
    frameId: '03 // FRAME',
    model: 'SDXL',
    artworkDesc: 'Translucent Glass UI Interface',
    prompt: '/imagine prompt: futuristic glassmorphism interface, translucent holographic UI panels, glowing neon accent rings, dark background, floating acrylic depth layers, cyberpunk control room --ar 16:9',
    gradient: 'linear-gradient(160deg, #0b1320 0%, #1a3147 55%, #080d17 100%)',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'pc-004',
    title: 'motion',
    frameId: '04 // FRAME',
    model: 'MJ v6.0',
    artworkDesc: 'Glossy Organic Fluid Sculpture',
    prompt: '/imagine prompt: abstract glossy dark purple organic fluid sculptures, metallic reflections, ultra-smooth liquid surface tension, studio product lighting, macro depth-of-field, floating zero-gravity --ar 1:1 --v 6.0 --stylize 950',
    gradient: 'linear-gradient(160deg, #170d28 0%, #3e1e5e 55%, #10081c 100%)',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'pc-005',
    title: 'identity',
    frameId: '05 // FRAME',
    model: 'MJ v6.0',
    artworkDesc: 'High Fashion Neon Rim Portrait',
    prompt: '/imagine prompt: high-fashion cinematic portrait, neon blue and magenta rim light, high contrast dramatic gaze, dark studio background, 85mm lens bokeh, editorial beauty shot --ar 4:5 --v 6.0 --stylize 800',
    gradient: 'linear-gradient(160deg, #0d121f 0%, #202b47 55%, #080c14 100%)',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85',
  },
];

/* ── Spatial Transform Mathematics (Scaled +25% for high-impact hero showcase) ── */
function getCardTransform(diff: number) {
  if (diff === 0) {
    return {
      translateX: 0, translateY: 0,
      rotateZ: 0, rotateY: 0,
      scale: 1.0, opacity: 1.0, zIndex: 30,
      boxShadow: '0 30px 60px -12px rgba(0,0,0,0.9), 0 0 35px rgba(255,107,74,0.18)',
    };
  }
  if (diff === 1) {
    return {
      translateX: 165, translateY: 14,
      rotateZ: 6.5, rotateY: -8,
      scale: 0.93, opacity: 0.88, zIndex: 20,
      boxShadow: '0 18px 36px -10px rgba(0,0,0,0.8)',
    };
  }
  if (diff === 2) {
    return {
      translateX: 320, translateY: 34,
      rotateZ: 14, rotateY: -15,
      scale: 0.84, opacity: 0.55, zIndex: 10,
      boxShadow: '0 18px 36px -10px rgba(0,0,0,0.8)',
    };
  }
  if (diff === -1) {
    return {
      translateX: -165, translateY: 14,
      rotateZ: -6.5, rotateY: 8,
      scale: 0.93, opacity: 0.88, zIndex: 20,
      boxShadow: '0 18px 36px -10px rgba(0,0,0,0.8)',
    };
  }
  if (diff === -2) {
    return {
      translateX: -320, translateY: 34,
      rotateZ: -14, rotateY: 15,
      scale: 0.84, opacity: 0.55, zIndex: 10,
      boxShadow: '0 18px 36px -10px rgba(0,0,0,0.8)',
    };
  }
  // Hidden reserve cards
  return {
    translateX: diff > 0 ? 420 : -420, translateY: 65,
    rotateZ: diff > 0 ? 20 : -20, rotateY: 0,
    scale: 0.72, opacity: 0, zIndex: 0,
    boxShadow: 'none',
  };
}

/* ── Main Component ── */
export default function FannedPromptCarousel() {
  const total = CARDS.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused,    setIsPaused]    = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [showToast,   setShowToast]   = useState(false);

  /* Drag/Swipe State */
  const [startX,     setStartX]    = useState<number | null>(null);
  const [startY,     setStartY]    = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setActiveIndex((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setActiveIndex((p) => (p - 1 + total) % total), [total]);

  /* Autoplay */
  useEffect(() => {
    if (isPaused || isDragging) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(next, 4500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isDragging, next]);

  /* Clipboard */
  const handleCopy = useCallback(() => {
    const text = CARDS[activeIndex].prompt;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setShowToast(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setShowToast(false), 2500);
  }, [activeIndex]);

  /* Pointer Handlers with capture */
  const handlePointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsPaused(true);
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || startX === null || startY === null) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    // Only activate if horizontal movement dominates
    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    if (deltaX > 0) prev(); else next();
    setStartX(null);
    setStartY(null);
    setIsDragging(false);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setStartX(null);
    setStartY(null);
    setIsPaused(false);
  };

  return (
    <div
      className="w-full relative flex flex-col items-center justify-center pt-2 min-h-[460px] sm:min-h-[510px] cursor-grab active:cursor-grabbing select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="region"
      aria-label="Prompt card carousel"
    >
      {/* Perspective Fanned Container */}
      <div
        className="relative w-full max-w-[1050px] h-[430px] sm:h-[480px] flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        {CARDS.map((card, idx) => {
          /* Circular diff calculation */
          let diff = idx - activeIndex;
          if (diff > total / 2)  diff -= total;
          if (diff < -total / 2) diff += total;

          const t = getCardTransform(diff);
          const isCurrent = diff === 0;

          return (
            <div
              key={card.id}
              onClick={() => !isCurrent && setActiveIndex(idx)}
              aria-label={isCurrent ? `Active: ${card.artworkDesc}` : card.artworkDesc}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveIndex(idx); }
                if (e.key === 'ArrowRight') next();
                if (e.key === 'ArrowLeft')  prev();
              }}
              className="absolute w-[290px] sm:w-[350px] h-[410px] sm:h-[460px] rounded-2xl bg-[#000000] border border-[#37324A] select-none flex flex-col justify-between outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B4A]"
              style={{
                transform: `translateX(${t.translateX}px) translateY(${t.translateY}px) rotateZ(${t.rotateZ}deg) rotateY(${t.rotateY}deg) scale(${t.scale})`,
                opacity: t.opacity,
                zIndex: t.zIndex,
                boxShadow: t.boxShadow,
                cursor: isCurrent ? 'default' : 'pointer',
                transition: 'transform 1500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1500ms cubic-bezier(0.16, 1, 0.3, 1), border-color 400ms ease, box-shadow 1500ms ease',
                willChange: 'transform, opacity',
                overflow: 'hidden',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                isolation: 'isolate',
              }}
            >
              {/* ── TOP: Visual Canvas (60%) ── */}
              <div
                style={{ background: card.gradient }}
                className="w-full h-[60%] relative flex items-center justify-center border-b border-[#37324A]/60 overflow-hidden"
              >
                {/* Real Render Image */}
                {card.image && (
                  <Image
                    src={card.image}
                    alt={card.artworkDesc}
                    fill
                    sizes="(max-width: 640px) 290px, 350px"
                    priority={idx === 0}
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    unoptimized
                  />
                )}

                {/* Dark Contrast Wash Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#14121A] via-black/35 to-black/25 pointer-events-none" />

                {/* Frame Sequence Badge — Top Left */}
                <div className="absolute top-3 left-3 font-mono text-[9px] font-semibold text-[#83E6C9] tracking-wider uppercase bg-[#14121A]/85 backdrop-blur-xs px-2.5 py-0.5 rounded border border-[#37324A]/70 shadow-sm z-20">
                  {card.frameId}
                </div>

                {/* Model Badge — Top Right */}
                <div className="absolute top-3 right-3 font-mono text-[9px] font-semibold text-[#A79FC4] tracking-wider uppercase bg-[#14121A]/85 backdrop-blur-xs px-2.5 py-0.5 rounded border border-[#37324A]/70 shadow-sm z-20">
                  {card.model}
                </div>
              </div>

              {/* ── BOTTOM: Syntax & Action Deck (40%) ── */}
              <div className="p-4 bg-[#14121A] flex-1 flex flex-col justify-between space-y-2 text-left">
                <div className="space-y-1.5">
                  {/* Artwork Category Label */}
                  <p className="font-mono text-[10px] font-semibold text-[#83E6C9] tracking-wider uppercase truncate">
                    {card.artworkDesc}
                  </p>

                  {/* Prompt Syntax Viewport */}
                  <div className="bg-[#1D1926] border border-[#37324A]/60 rounded-md p-2.5">
                    <p className="font-mono text-[11px] leading-relaxed text-[#A79FC4] line-clamp-2">
                      {card.prompt}
                    </p>
                  </div>
                </div>

                {/* Copy CTA */}
                <Button
                  disabled={!isCurrent}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isCurrent) handleCopy();
                  }}
                  aria-label="Copy prompt syntax to clipboard"
                  className={`w-full font-sans font-semibold h-9 text-xs gap-2 transition-all duration-300 border-0 ${
                    copied && isCurrent
                      ? 'bg-[#83E6C9] hover:bg-[#83E6C9] text-[#14121A]'
                      : 'bg-[#FF6B4A] hover:bg-[#e85a39] text-[#14121A]'
                  } disabled:opacity-40 disabled:pointer-events-none`}
                >
                  {copied && isCurrent ? (
                    <>
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Prompt Syntax</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dot Navigation Indicators */}
      <div className="flex items-center gap-1.5 mt-5" role="tablist" aria-label="Carousel navigation">
        {CARDS.map((card, idx) => (
          <button
            key={card.id}
            role="tab"
            aria-selected={idx === activeIndex}
            aria-label={`Go to card ${idx + 1}: ${card.artworkDesc}`}
            onClick={(e) => { e.stopPropagation(); setActiveIndex(idx); }}
            className={`rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B4A] ${
              idx === activeIndex
                ? 'w-6 h-1.5 bg-[#FF6B4A]'
                : 'w-1.5 h-1.5 bg-[#37324A] hover:bg-[#A79FC4]'
            }`}
          />
        ))}
      </div>

      {/* Bottom Toast Notification */}
      {showToast && (
        <div className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 bg-[#83E6C9] text-[#14121A] font-mono text-xs font-bold px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 border border-[#14121A] z-40 animate-bounce whitespace-nowrap">
          <Check className="h-3.5 w-3.5 stroke-[3]" />
          <span>Prompt syntax copied to clipboard!</span>
        </div>
      )}
    </div>
  );
}
