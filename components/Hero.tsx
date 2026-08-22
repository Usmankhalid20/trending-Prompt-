'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Copy, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ── 7 Cinematic Cards Sequence ── */
const CAROUSEL_CARDS = [
  {
    id: 1,
    title: 'spatial',
    frameId: 'CS·001',
    aspect: '--ar 16:9',
    model: 'MJ v6.0',
    prompt: '/imagine prompt: brutalist concrete architectural corridor, dramatic overhead chiaroscuro lighting, moody atmospheric shadows --ar 16:9 --v 6.0',
    gradient: 'linear-gradient(180deg, #111018 0%, #1e1b29 55%, #0d0c12 100%)',
    artworkDesc: 'Brutalist Architectural Corridor',
    hasImage: true,
    bgClass: 'bg-stone-900',
  },
  {
    id: 2,
    title: 'identity',
    frameId: 'CS·002',
    aspect: '--ar 4:5',
    model: 'MJ v6.0',
    prompt: '/imagine prompt: mysterious silhouette figure standing in foggy atmospheric dark chamber, rim lighting, cinematic 35mm --ar 4:5 --v 6.0',
    gradient: 'linear-gradient(180deg, #140d1a 0%, #291a2e 55%, #100a14 100%)',
    artworkDesc: 'Cinematic Human Silhouette',
    hasImage: true,
    bgClass: 'bg-zinc-900',
  },
  {
    id: 3,
    title: 'editorial',
    frameId: 'CS·003',
    aspect: '--ar 3:4',
    model: 'DALL·E 3',
    prompt: '/imagine prompt: editorial fashion layout, floating minimal black typography cards, textured beige paper layers, studio lighting --ar 3:4',
    gradient: 'linear-gradient(180deg, #1a1622 0%, #3b3247 55%, #120e18 100%)',
    artworkDesc: 'Minimal Editorial Layout',
    hasImage: true,
    bgClass: 'bg-neutral-900',
  },
  {
    id: 4,
    title: 'digital',
    frameId: 'CS·004',
    aspect: '--ar 16:9',
    model: 'SDXL',
    prompt: '/imagine prompt: futuristic glassmorphism interface, translucent holographic UI elements, dark glowing neon accents --ar 16:9',
    gradient: 'linear-gradient(180deg, #0b1320 0%, #1a3147 55%, #080d17 100%)',
    artworkDesc: 'Translucent Glass Interface',
    hasImage: true,
    bgClass: 'bg-slate-900',
  },
  {
    id: 5,
    title: 'spatial',
    frameId: 'CS·005',
    aspect: '--ar 16:9',
    model: 'MJ v6.0',
    prompt: '/imagine prompt: minimalist monolithic concrete courtyard at dusk, golden sunlight ray, shadow play, cinematic architectural photography --ar 16:9',
    gradient: 'linear-gradient(180deg, #161220 0%, #38293d 55%, #0f0c17 100%)',
    artworkDesc: 'Monolithic Dusk Courtyard',
    hasImage: true,
    bgClass: 'bg-gray-900',
  },
  {
    id: 6,
    title: 'motion',
    frameId: 'CS·006',
    aspect: '--ar 1:1',
    model: 'MJ v6.0',
    prompt: '/imagine prompt: abstract glossy dark purple organic fluid sculptures, metallic reflections, smooth fluid motion, studio lighting --ar 1:1',
    gradient: 'linear-gradient(180deg, #170d28 0%, #3e1e5e 55%, #10081c 100%)',
    artworkDesc: 'Glossy Organic Fluid',
    hasImage: true,
    bgClass: 'bg-purple-950',
  },
  {
    id: 7,
    title: 'identity',
    frameId: 'CS·007',
    aspect: '--ar 4:5',
    model: 'MJ v6.0',
    prompt: '/imagine prompt: high-fashion cinematic portrait, neon blue and magenta rim light, high contrast, dramatic gaze, 85mm lens --ar 4:5',
    gradient: 'linear-gradient(180deg, #0d121f 0%, #202b47 55%, #080c14 100%)',
    artworkDesc: 'High Fashion Rim Light',
    hasImage: true,
    bgClass: 'bg-indigo-950',
  },
];

const ROTATING_WORDS = ['Midjourney', 'DALL·E 3', 'Cyberpunk', 'Architectural', 'Editorial', 'Stable Diffusion'];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(1); // Default to "identity" frame
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  /* 3D Kinetic Text Reel State */
  const [wordIndex, setWordIndex] = useState(0);
  const [wordAnimState, setWordAnimState] = useState<'enter' | 'exit'>('enter');

  /* Drag & Swipe Cursor State */
  const [startX, setStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const total = CAROUSEL_CARDS.length;

  /* Dynamic 3D Word Flip Reel (2.4s cycle) */
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordAnimState('exit');
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setWordAnimState('enter');
      }, 400);
    }, 2400);

    return () => clearInterval(wordInterval);
  }, []);

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  /* Auto-play carousel interval */
  useEffect(() => {
    if (isPaused || isDragging) return;
    timerRef.current = setInterval(() => {
      nextCard();
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isDragging]);

  const activeCard = CAROUSEL_CARDS[activeIndex];

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(activeCard.prompt).catch(() => fallbackCopy(activeCard.prompt));
    } else {
      fallbackCopy(activeCard.prompt);
    }
    setCopied(true);
    setShowToast(true);

    setTimeout(() => setCopied(false), 2500);
    setTimeout(() => setShowToast(false), 3000);
  };

  const fallbackCopy = (text: string) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  };

  /* Drag / Swipe Pointer Handlers */
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsPaused(true);
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || startX === null) return;
    const deltaX = e.clientX - startX;

    if (deltaX > 45) {
      prevCard();
      setStartX(e.clientX);
      setIsDragging(false);
    } else if (deltaX < -45) {
      nextCard();
      setStartX(e.clientX);
      setIsDragging(false);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setStartX(null);
    setIsPaused(false);
  };

  return (
    <section className="relative bg-[#14121A] border-b border-[#37324A] pt-16 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
      
      {/* ── Keyframes Style Block for 3D Kinetic Text & Shimmer Sweep ── */}
      <style jsx global>{`
        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroScaleIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(24px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes textShimmerSweep {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .anim-fade-up-1 {
          animation: heroFadeUp 1000ms cubic-bezier(0.16, 1, 0.3, 1) 100ms both;
        }
        .anim-fade-up-2 {
          animation: heroFadeUp 1000ms cubic-bezier(0.16, 1, 0.3, 1) 300ms both;
        }
        .anim-fade-up-3 {
          animation: heroFadeUp 1000ms cubic-bezier(0.16, 1, 0.3, 1) 500ms both;
        }
        .anim-fade-up-4 {
          animation: heroFadeUp 1000ms cubic-bezier(0.16, 1, 0.3, 1) 700ms both;
        }
        .anim-scale-in {
          animation: heroScaleIn 1200ms cubic-bezier(0.16, 1, 0.3, 1) 900ms both;
        }

        .kinetic-word-enter {
          opacity: 1;
          transform: translateY(0) rotateX(0deg);
          filter: blur(0px);
        }
        .kinetic-word-exit {
          opacity: 0;
          transform: translateY(-24px) rotateX(60deg);
          filter: blur(4px);
        }
      `}</style>

      {/* Subdued Light-Table Ambient Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(131,230,201,0.05)_0%,transparent_70%),radial-gradient(ellipse_50%_40%_at_50%_70%,rgba(255,107,74,0.06)_0%,transparent_70%)] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-12 relative z-10">
        
        {/* ── TOP SECTION: Apple/Framer-Level 3D Kinetic Text Reel & Headline ── */}
        <div className="max-w-3xl mx-auto space-y-6 items-center flex flex-col">
          
          {/* Eyebrow Tag */}
          <div className="anim-fade-up-1 inline-flex items-center gap-2 rounded-md border border-[#83E6C9]/30 bg-[#83E6C9]/10 px-3.5 py-1 text-xs font-mono font-semibold text-[#83E6C9] tracking-wider uppercase shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>LIGHT-TABLE PROMPT GALLERY</span>
          </div>

          {/* 3D Kinetic Perspective Headline */}
          <h1 className="anim-fade-up-2 font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] text-[#EDE9F7]">
            Discover &amp; copy battle-tested{' '}
            <span
              className="inline-block relative overflow-hidden align-bottom"
              style={{ perspective: '800px' }}
            >
              <span
                className={`inline-block text-[#FF6B4A] transition-all duration-400 ease-out origin-bottom ${
                  wordAnimState === 'enter' ? 'kinetic-word-enter' : 'kinetic-word-exit'
                }`}
              >
                {ROTATING_WORDS[wordIndex]}
              </span>
            </span>{' '}
            image prompts.
          </h1>

          {/* Subtitle (IBM Plex Sans) */}
          <p className="anim-fade-up-3 text-base sm:text-lg font-sans text-[#A79FC4] leading-relaxed max-w-2xl">
            A curated library of exact prompt recipes for Midjourney, DALL·E 3, and Stable
            Diffusion — tagged with real parameters and aspect ratios. Copy the exact syntax,
            paste it into your generator, and render.
          </p>

          {/* Action CTAs */}
          <div className="anim-fade-up-4 flex flex-wrap items-center justify-center gap-3 pt-2">
            <a href="#explore" id="hero-explore-cta">
              <Button size="lg" className="bg-[#FF6B4A] hover:bg-[#e85a39] text-[#14121A] font-sans font-semibold gap-2 shadow-md text-base px-7 h-12 border-0 transition-transform active:scale-95">
                Explore Prompts
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>

            <Link href="/register" id="hero-register-cta">
              <Button variant="outline" size="lg" className="border-[#37324A] text-[#EDE9F7] hover:bg-[#1D1926] font-sans font-semibold text-base px-7 h-12">
                Create free account
              </Button>
            </Link>
          </div>
        </div>

        {/* ── BOTTOM SECTION: 3D Fanned Editorial Card Carousel with 1-sec Transition & Smooth Swipe ── */}
        <div
          className="anim-scale-in w-full relative flex flex-col items-center justify-center pt-6 min-h-[440px] sm:min-h-[480px] cursor-grab active:cursor-grabbing select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Perspective Fanned Container */}
          <div
            className="relative w-full max-w-[900px] h-[400px] sm:h-[440px] flex items-center justify-center"
            style={{ perspective: '1200px' }}
          >
            {CAROUSEL_CARDS.map((card, idx) => {
              // Calculate relative circular offset (-3 to +3)
              let diff = idx - activeIndex;
              if (diff > total / 2) diff -= total;
              if (diff < -total / 2) diff += total;

              // Fanned Arch Transformations matching high-end editorial portfolios
              let translateX = 0;
              let translateY = 0;
              let rotateZ = 0;
              let rotateY = 0;
              let scale = 1;
              let opacity = 0;
              let zIndex = 0;

              if (diff === 0) {
                // Active Center Card
                translateX = 0;
                translateY = 0;
                rotateZ = 0;
                rotateY = 0;
                scale = 1.0;
                opacity = 1.0;
                zIndex = 30;
              } else if (diff === 1) {
                // Right 1 Card
                translateX = 135;
                translateY = 12;
                rotateZ = 7;
                rotateY = -8;
                scale = 0.92;
                opacity = 0.85;
                zIndex = 20;
              } else if (diff === 2) {
                // Far Right Card 2
                translateX = 265;
                translateY = 32;
                rotateZ = 15;
                rotateY = -15;
                scale = 0.82;
                opacity = 0.55;
                zIndex = 10;
              } else if (diff === -1) {
                // Left 1 Card
                translateX = -135;
                translateY = 12;
                rotateZ = -7;
                rotateY = 8;
                scale = 0.92;
                opacity = 0.85;
                zIndex = 20;
              } else if (diff === -2) {
                // Far Left Card 2
                translateX = -265;
                translateY = 32;
                rotateZ = -15;
                rotateY = 15;
                scale = 0.82;
                opacity = 0.55;
                zIndex = 10;
              } else {
                // Hidden background stack
                translateX = diff > 0 ? 340 : -340;
                translateY = 60;
                rotateZ = diff > 0 ? 22 : -22;
                scale = 0.7;
                opacity = 0;
                zIndex = 0;
              }

              const isCurrent = diff === 0;

              return (
                <div
                  key={card.id}
                  onClick={() => setActiveIndex(idx)}
                  className="absolute w-[270px] sm:w-[310px] h-[390px] sm:h-[420px] rounded-2xl bg-[#000000] border border-[#37324A] shadow-2xl overflow-hidden cursor-pointer select-none flex flex-col justify-between"
                  style={{
                    transform: `translateX(${translateX}px) translateY(${translateY}px) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex,
                    transition:
                      'transform 1000ms cubic-bezier(0.34, 1.25, 0.64, 1), opacity 1000ms ease, border-color 300ms ease',
                    boxShadow: isCurrent
                      ? '0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 30px rgba(255, 107, 74, 0.15)'
                      : '0 15px 30px -10px rgba(0, 0, 0, 0.75)',
                  }}
                >
                  {/* Top Artwork Area with Centered Lowercase Italic Title */}
                  <div
                    style={{ background: card.gradient }}
                    className="w-full h-[60%] relative flex items-center justify-center border-b border-[#37324A]/60 overflow-hidden"
                  >
                    {/* Subtle Overlay Grain */}
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Centered Editorial Lowercase Title (Smooth 1-sec Transition Pop) */}
                    <span
                      className="relative z-10 font-sans italic text-sm sm:text-base font-normal text-[#EDE9F7]/90 tracking-widest lowercase select-none drop-shadow-md transition-all duration-1000"
                      style={{
                        transform: isCurrent ? 'scale(1.05)' : 'scale(0.95)',
                        opacity: isCurrent ? 1 : 0.7,
                      }}
                    >
                      {card.title}
                    </span>

                    {/* Top Mono Frame Tag */}
                    <div className="absolute top-2.5 left-3 font-mono text-[9px] font-semibold text-[#83E6C9] tracking-wider uppercase bg-[#14121A]/70 px-2 py-0.5 rounded border border-[#37324A]/50">
                      {card.frameId}
                    </div>

                    <div className="absolute top-2.5 right-3 font-mono text-[9px] font-semibold text-[#A79FC4] tracking-wider uppercase bg-[#14121A]/70 px-2 py-0.5 rounded border border-[#37324A]/50">
                      {card.model}
                    </div>
                  </div>

                  {/* Bottom Content Area (Prompt & Copy Action) */}
                  <div className="p-4 bg-[#14121A] flex-1 flex flex-col justify-between space-y-2 text-left">
                    <div className="space-y-1">
                      <p className="font-mono text-[10px] font-semibold text-[#83E6C9] tracking-wider uppercase">
                        {card.artworkDesc}
                      </p>
                      <div className="bg-[#1D1926] border border-[#37324A]/60 rounded-md p-2">
                        <p className="font-mono text-[10px] leading-relaxed text-[#A79FC4] line-clamp-2">
                          {card.prompt}
                        </p>
                      </div>
                    </div>

                    {/* Copy Button */}
                    <Button
                      disabled={!isCurrent}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrent) handleCopy();
                      }}
                      className={`w-full font-sans font-semibold h-8 text-[11px] gap-1.5 transition-all border-0 ${
                        copied && isCurrent
                          ? 'bg-[#83E6C9] hover:bg-[#83E6C9] text-[#14121A]'
                          : 'bg-[#FF6B4A] hover:bg-[#e85a39] text-[#14121A]'
                      }`}
                    >
                      {copied && isCurrent ? (
                        <>
                          <Check className="h-3 w-3 stroke-[3]" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy Prompt Syntax</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Toast Notification */}
          {showToast && (
            <div className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 bg-[#83E6C9] text-[#14121A] font-mono text-xs font-bold px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 border border-[#14121A] z-40 animate-bounce">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
              <span>Prompt syntax copied to clipboard!</span>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
