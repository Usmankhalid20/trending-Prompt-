'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Copy, Check, Eye, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PromptDetailsModal from '@/components/PromptDetailsModal';

/* ── High-Quality Curated Editorial Catalogue with Demo Images ── */
const CURATED_PROMPTS = [
  {
    _id: 'curated-1',
    title: 'Cyberpunk Ronin in Rain',
    category: 'Editorial / Dress',
    aiModel: 'Midjourney',
    frameId: 'CS·101',
    aspect: '--ar 16:9',
    prompt: '/imagine prompt: futuristic cyberpunk samurai in heavy rain, glowing neon katana, reflective wet asphalt pavement, volumetric fog, dramatic rim light --ar 16:9 --v 6.0 --stylize 850',
    description: 'Cinematic cyberpunk warrior render with ultra-high detail neon reflections and volumetric atmospheric rain fog.',
    authorName: 'alex_cyber_art',
    gradient: 'linear-gradient(135deg, #0d1222 0%, #1e2942 50%, #442a54 100%)',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=85',
    copiesCount: 1420,
    tags: ['Cyberpunk', 'Samurai', 'Neon', 'Rain'],
  },
  {
    _id: 'curated-2',
    title: 'Brutalist Concrete Monolith',
    category: 'Architecture',
    aiModel: 'Midjourney',
    frameId: 'CS·102',
    aspect: '--ar 4:5',
    prompt: '/imagine prompt: brutalist concrete architectural courtyard at dusk, golden sunlight ray casting sharp geometric shadows, minimalist aesthetic --ar 4:5 --v 6.0 --stylize 750',
    description: 'High-end architectural render featuring brutalist monolithic concrete structures under sharp golden hour shadows.',
    authorName: 'arch_studio_v6',
    gradient: 'linear-gradient(135deg, #181424 0%, #38293d 50%, #FF6B4A 100%)',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    copiesCount: 980,
    tags: ['Brutalist', 'Architecture', 'Monolith', 'Shadows'],
  },
  {
    _id: 'curated-3',
    title: 'Translucent Glass UI Interface',
    category: 'Abstract',
    aiModel: 'Stable Diffusion',
    frameId: 'CS·103',
    aspect: '--ar 16:9',
    prompt: '/imagine prompt: futuristic glassmorphism UI dash, glowing holographic neon charts, translucent acrylic floating panels, dark darkroom background --ar 16:9',
    description: 'Futuristic glassmorphic web app interface mockup with glowing neon typography and depth layers.',
    authorName: 'hologram_ui',
    gradient: 'linear-gradient(135deg, #0e1626 0%, #1a3147 50%, #83E6C9 100%)',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=85',
    copiesCount: 2310,
    tags: ['Glassmorphism', 'UI Design', 'Holographic', 'Abstract'],
  },
  {
    _id: 'curated-4',
    title: 'Beige Editorial Magazine Spread',
    category: 'Editorial / Dress',
    aiModel: 'DALL-E 3',
    frameId: 'CS·104',
    aspect: '--ar 3:4',
    prompt: '/imagine prompt: high-fashion editorial magazine cover, floating minimal black serif typography cards, textured beige paper layers, studio portrait lighting --ar 3:4',
    description: 'Vogue-inspired editorial fashion layout with floating typography elements and textured natural paper.',
    authorName: 'editorial_vogue',
    gradient: 'linear-gradient(135deg, #1c1824 0%, #3b3247 50%, #827263 100%)',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    copiesCount: 1750,
    tags: ['Editorial', 'Fashion', 'Typography', 'Magazine'],
  },
  {
    _id: 'curated-5',
    title: 'Mysterious Atmospheric Silhouette',
    category: 'Couple Portraits',
    aiModel: 'Midjourney',
    frameId: 'CS·105',
    aspect: '--ar 4:5',
    prompt: '/imagine prompt: mysterious high-fashion human silhouette figure standing in foggy dark chamber, rim lighting, 35mm film grain texture --ar 4:5 --v 6.0',
    description: 'Moody 35mm cinematic film portrait with deep blacks, dramatic rim lighting, and atmospheric smoke fog.',
    authorName: 'film_noir_35mm',
    gradient: 'linear-gradient(135deg, #140d1a 0%, #291a2e 50%, #52273c 100%)',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85',
    copiesCount: 3100,
    tags: ['Silhouette', 'Film Grain', 'Moody', 'Portrait'],
  },
  {
    _id: 'curated-6',
    title: 'Glossy Fluid Sculpture',
    category: 'Abstract',
    aiModel: 'Midjourney',
    frameId: 'CS·106',
    aspect: '--ar 1:1',
    prompt: '/imagine prompt: abstract glossy dark purple organic fluid sculpture, metallic chrome reflections, smooth liquid motion, studio lighting --ar 1:1 --v 6.0',
    description: '3D metallic fluid sculpture render with glossy purple gradients and studio softbox reflections.',
    authorName: 'motion_fluid_lab',
    gradient: 'linear-gradient(135deg, #170d28 0%, #3e1e5e 50%, #6e3294 100%)',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
    copiesCount: 840,
    tags: ['Abstract', 'Fluid', '3D Render', 'Glossy'],
  },
];

const CATEGORIES = ['All', 'Editorial / Dress', 'Architecture', 'Abstract', 'Couple Portraits', 'Fantasy Scenes'];

export default function ExploreSection() {
  const [promptsList, setPromptsList] = useState<any[]>(CURATED_PROMPTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrompt, setSelectedPrompt] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const res = await fetch('/api/prompts');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPromptsList([...data, ...CURATED_PROMPTS]);
        }
      }
    } catch (e) {
      console.error('Using fallback curated prompts gallery', e);
    }
  };

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPrompts = promptsList.filter((p) => {
    return selectedCategory === 'All' || p.category === selectedCategory;
  });

  return (
    <section id="explore" className="bg-[#14121A] border-b border-[#37324A] py-16 sm:py-28 relative overflow-hidden">
      
      {/* Background Subtle Glow Overlay */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(255,107,74,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* ── Section Header & Direct Category Tabs ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#37324A]/60">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#83E6C9]/30 bg-[#83E6C9]/10 px-3.5 py-1 text-xs font-mono font-semibold text-[#83E6C9] tracking-wider uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>PROMPT CATALOGUE &amp; CONTACT SHEET</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#EDE9F7] tracking-tight">
              Explore battle-tested AI prompts
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#A79FC4] leading-relaxed">
              Browse verified prompt recipes with complete aspect ratio flags, model parameters, and formatted syntax strings.
            </p>
          </div>

          {/* Clean Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all border ${
                  selectedCategory === c
                    ? 'bg-[#FF6B4A] text-[#14121A] border-[#FF6B4A] shadow-xs'
                    : 'bg-[#1D1926] text-[#A79FC4] border-[#37324A] hover:text-[#EDE9F7] hover:bg-[#262131]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* ── Prompts Card Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((p, index) => {
            const id = p._id || p.id || `prompt-${index}`;
            const gradient = p.gradient || 'linear-gradient(135deg, #181424 0%, #38293d 50%, #FF6B4A 100%)';
            const frameTag = p.frameId || `CS·${101 + index}`;
            const aspectTag = p.aspect || '--ar 16:9';
            const imageUrl = p.image || p.imageUrl;

            return (
              <div
                key={id}
                onClick={() => setSelectedPrompt(p)}
                className="group rounded-2xl border border-[#37324A] bg-[#1D1926] overflow-hidden shadow-lg hover:-translate-y-1.5 hover:border-[#FF6B4A]/70 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >

                {/* Artwork Image / Visual Preview Swatch */}
                <div className="relative aspect-16/9 w-full bg-[#14121A] overflow-hidden border-b border-[#37324A]">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={p.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      unoptimized
                    />
                  ) : (
                    <div
                      style={{ background: gradient }}
                      className="w-full h-full flex items-center justify-center p-4 relative group-hover:scale-105 transition-transform duration-500"
                    >
                      <div className="absolute inset-0 bg-black/20" />
                      <span className="relative z-10 font-sans italic text-sm font-normal text-[#EDE9F7]/90 tracking-widest lowercase select-none drop-shadow-md">
                        {p.category || 'artwork'}
                      </span>
                    </div>
                  )}

                  {/* Dark subtle overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14121A]/70 via-transparent to-transparent pointer-events-none" />

                  {/* Quick Inspect Hover Overlay */}
                  <div className="absolute inset-0 bg-[#14121A]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                    <span className="font-sans text-xs font-semibold text-[#EDE9F7] flex items-center gap-1.5 bg-[#14121A] px-3.5 py-1.5 rounded-lg border border-[#37324A] shadow-md">
                      <Eye className="h-3.5 w-3.5 text-[#FF6B4A]" /> Inspect Recipe
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-base text-[#EDE9F7] line-clamp-1 group-hover:text-[#FF6B4A] transition-colors">
                      {p.title}
                    </h3>

                    {/* Code Syntax Block (IBM Plex Mono) */}
                    <div className="bg-[#14121A] border border-[#37324A]/70 rounded-lg p-2.5">
                      <p className="font-mono text-[11px] leading-relaxed text-[#A79FC4] line-clamp-2 select-all">
                        {p.prompt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-2 border-t border-[#37324A]/60 flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-[#83E6C9] font-medium truncate">
                      BY @{p.authorName?.toLowerCase().replace(/\s+/g, '_') || 'cinematic_art'}
                    </span>

                    <Button
                      size="sm"
                      onClick={(e) => handleCopy(id, p.prompt, e)}
                      className={`h-8 px-3 text-xs font-sans font-semibold border-0 transition-all ${
                        copiedId === id
                          ? 'bg-[#83E6C9] hover:bg-[#83E6C9] text-[#14121A]'
                          : 'bg-[#FF6B4A] hover:bg-[#e85a39] text-[#14121A]'
                      }`}
                    >
                      {copiedId === id ? (
                        <>
                          <Check className="h-3.5 w-3.5 stroke-[3]" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy Prompt
                        </>
                      )}
                    </Button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Inspection Modal */}
        {selectedPrompt && (
          <PromptDetailsModal
            prompt={selectedPrompt}
            isOpen={!!selectedPrompt}
            onClose={() => setSelectedPrompt(null)}
          />
        )}

      </div>
    </section>
  );
}
