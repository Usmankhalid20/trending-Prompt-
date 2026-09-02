'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Copy, Check, Eye, Sparkles, Flame, Star, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PromptDetailsModal from '@/components/PromptDetailsModal';

/* ── High-Quality Curated Editorial Catalogue with Demo Images ── */
const CURATED_PROMPTS = [
  {
    _id: 'curated-1',
    title: 'Cyberpunk Ronin in Rain',
    category: 'Cinematic',
    aiModel: 'Midjourney',
    frameId: 'CS·101',
    aspect: '16:9',
    aspectTag: '--ar 16:9',
    prompt: '/imagine prompt: futuristic cyberpunk samurai in heavy rain, glowing neon katana, reflective wet asphalt pavement, volumetric fog, dramatic rim light --ar 16:9 --v 6.0 --stylize 850',
    description: 'Cinematic cyberpunk warrior render with ultra-high detail neon reflections and volumetric atmospheric rain fog.',
    authorName: 'alex_cyber_art',
    gradient: 'linear-gradient(135deg, #0d1222 0%, #1e2942 50%, #442a54 100%)',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=85',
    copiesCount: 3420,
    isEditorsPick: true,
    tags: ['Cyberpunk', 'Samurai', 'Neon', 'Rain'],
  },
  {
    _id: 'curated-2',
    title: 'Brutalist Concrete Monolith',
    category: 'Architecture',
    aiModel: 'Midjourney',
    frameId: 'CS·102',
    aspect: '4:5',
    aspectTag: '--ar 4:5',
    prompt: '/imagine prompt: brutalist concrete architectural courtyard at dusk, golden sunlight ray casting sharp geometric shadows, minimalist aesthetic --ar 4:5 --v 6.0 --stylize 750',
    description: 'High-end architectural render featuring brutalist monolithic concrete structures under sharp golden hour shadows.',
    authorName: 'arch_studio_v6',
    gradient: 'linear-gradient(135deg, #181424 0%, #38293d 50%, #FF6B4A 100%)',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    copiesCount: 2980,
    isEditorsPick: true,
    tags: ['Brutalist', 'Architecture', 'Monolith', 'Shadows'],
  },
  {
    _id: 'curated-3',
    title: 'Translucent Glass UI Interface',
    category: 'Abstract',
    aiModel: 'Stable Diffusion',
    frameId: 'CS·103',
    aspect: '16:9',
    aspectTag: '--ar 16:9',
    prompt: '/imagine prompt: futuristic glassmorphism UI dash, glowing holographic neon charts, translucent acrylic floating panels, dark darkroom background --ar 16:9',
    description: 'Futuristic glassmorphic web app interface mockup with glowing neon typography and depth layers.',
    authorName: 'hologram_ui',
    gradient: 'linear-gradient(135deg, #0e1626 0%, #1a3147 50%, #83E6C9 100%)',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=85',
    copiesCount: 2310,
    isEditorsPick: false,
    tags: ['Glassmorphism', 'UI Design', 'Holographic', 'Abstract'],
  },
  {
    _id: 'curated-4',
    title: 'Beige Editorial Magazine Spread',
    category: 'Editorial / Portrait',
    aiModel: 'DALL·E 3',
    frameId: 'CS·104',
    aspect: '3:4',
    aspectTag: '--ar 3:4',
    prompt: '/imagine prompt: high-fashion editorial magazine cover, floating minimal black serif typography cards, textured beige paper layers, studio portrait lighting --ar 3:4',
    description: 'Vogue-inspired editorial fashion layout with floating typography elements and textured natural paper.',
    authorName: 'editorial_vogue',
    gradient: 'linear-gradient(135deg, #1c1824 0%, #3b3247 50%, #827263 100%)',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    copiesCount: 3750,
    isEditorsPick: true,
    tags: ['Editorial', 'Fashion', 'Typography', 'Magazine'],
  },
  {
    _id: 'curated-5',
    title: 'Mysterious Atmospheric Silhouette',
    category: 'Cinematic',
    aiModel: 'Midjourney',
    frameId: 'CS·105',
    aspect: '4:5',
    aspectTag: '--ar 4:5',
    prompt: '/imagine prompt: mysterious high-fashion human silhouette figure standing in foggy dark chamber, rim lighting, 35mm film grain texture --ar 4:5 --v 6.0',
    description: 'Moody 35mm cinematic film portrait with deep blacks, dramatic rim lighting, and atmospheric smoke fog.',
    authorName: 'film_noir_35mm',
    gradient: 'linear-gradient(135deg, #140d1a 0%, #291a2e 50%, #52273c 100%)',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85',
    copiesCount: 3100,
    isEditorsPick: false,
    tags: ['Silhouette', 'Film Grain', 'Moody', 'Portrait'],
  },
  {
    _id: 'curated-6',
    title: 'Glossy Fluid Sculpture',
    category: 'Abstract',
    aiModel: 'Midjourney',
    frameId: 'CS·106',
    aspect: '1:1',
    aspectTag: '--ar 1:1',
    prompt: '/imagine prompt: abstract glossy dark purple organic fluid sculpture, metallic chrome reflections, smooth liquid motion, studio lighting --ar 1:1 --v 6.0',
    description: '3D metallic fluid sculpture render with glossy purple gradients and studio softbox reflections.',
    authorName: 'motion_fluid_lab',
    gradient: 'linear-gradient(135deg, #170d28 0%, #3e1e5e 50%, #6e3294 100%)',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
    copiesCount: 1840,
    isEditorsPick: false,
    tags: ['Abstract', 'Fluid', '3D Render', 'Glossy'],
  },
];

const STYLES = ['All', 'Architecture', 'Editorial / Portrait', 'Cinematic', 'Abstract'];
const MODELS = ['All Models', 'Midjourney', 'DALL·E 3', 'Stable Diffusion'];
const RATIOS = ['All Ratios', '16:9', '4:5', '3:4', '1:1'];
const SORTS = ['Most Popular', 'Most Copied', 'Newest'];

export default function ExploreSection() {
  const [promptsList, setPromptsList] = useState<any[]>(CURATED_PROMPTS);
  const [selectedTab, setSelectedTab] = useState<'trending' | 'newest' | 'popular'>('trending');
  
  /* Multi-dimensional filters */
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [selectedModel, setSelectedModel] = useState('All Models');
  const [selectedRatio, setSelectedRatio] = useState('All Ratios');
  const [selectedSort, setSelectedSort] = useState('Most Popular');

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

  /* Editor's Picks */
  const editorsPicks = promptsList.filter((p) => p.isEditorsPick || p._id === 'curated-1' || p._id === 'curated-4' || p._id === 'curated-2').slice(0, 3);

  /* Filter & Sort Logic */
  const filteredPrompts = promptsList.filter((p) => {
    const matchStyle = selectedStyle === 'All' || p.category === selectedStyle || (selectedStyle === 'Editorial / Portrait' && (p.category?.includes('Editorial') || p.category?.includes('Portrait')));
    const matchModel = selectedModel === 'All Models' || (p.aiModel && p.aiModel.toLowerCase().includes(selectedModel.toLowerCase().replace('·', '').trim()));
    const matchRatio = selectedRatio === 'All Ratios' || p.aspect === selectedRatio || p.aspectTag?.includes(selectedRatio);
    return matchStyle && matchModel && matchRatio;
  });

  return (
    <section id="explore" className="bg-background border-b border-border py-16 sm:py-24 relative overflow-hidden transition-colors duration-200">
      
      {/* Background Subtle Glow Overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(255,107,74,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* ── 1. MAIN SECTION HEADER & DISCOVERY TABS ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-semibold text-emerald-600 dark:text-[#83E6C9] tracking-wider uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>PROMPT DISCOVERY ENGINE</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
              Explore image prompts
            </h2>
            <p className="font-sans text-base text-muted-foreground leading-relaxed">
              Find a prompt by style, model, or use case. Complete parameter flags and verified preview outputs included.
            </p>
          </div>

          {/* Discovery View Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-secondary p-1.5 rounded-xl border border-border shadow-xs">
            <button
              onClick={() => setSelectedTab('trending')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                selectedTab === 'trending'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Flame className="h-3.5 w-3.5" /> Trending
            </button>
            <button
              onClick={() => setSelectedTab('popular')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                selectedTab === 'popular'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Star className="h-3.5 w-3.5" /> Popular
            </button>
            <button
              onClick={() => setSelectedTab('newest')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                selectedTab === 'newest'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock className="h-3.5 w-3.5" /> Newest
            </button>
          </div>
        </div>

        {/* ── 2. SPOTLIGHT: EDITOR'S PICKS (3 Strongest Prompts) ── */}
        <div className="space-y-6 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground tracking-tight">
                Editor&apos;s Picks
              </h3>
            </div>
            <span className="font-mono text-xs text-emerald-600 dark:text-[#83E6C9] uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
              Hand-Tested Standouts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {editorsPicks.map((p, idx) => {
              const id = p._id || `pick-${idx}`;
              const imageUrl = p.image || p.imageUrl;
              return (
                <div
                  key={id}
                  onClick={() => setSelectedPrompt(p)}
                  className="group relative rounded-2xl border-2 border-primary/50 bg-card overflow-hidden shadow-lg hover:border-primary transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  {/* Spotlight Top Badge */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-primary text-primary-foreground px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase shadow-md">
                    <Star className="h-3 w-3 fill-current" /> Editor&apos;s Choice
                  </div>

                  <div className="relative aspect-16/10 w-full bg-secondary overflow-hidden border-b border-border">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={idx === 0}
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                        <span className="text-emerald-600 dark:text-[#83E6C9] font-bold uppercase">{p.aiModel || 'Midjourney'}</span>
                        <span>{p.aspectTag || '--ar 16:9'}</span>
                      </div>
                      <h4 className="font-display font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {p.title}
                      </h4>
                      <div className="bg-secondary/70 border border-border rounded-lg p-2.5">
                        <p className="font-mono text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                          {p.prompt}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-emerald-600 dark:text-[#83E6C9] font-medium">
                        {p.copiesCount ? `${p.copiesCount.toLocaleString()} copies` : 'Verified recipe'}
                      </span>
                      <Button
                        size="sm"
                        onClick={(e) => handleCopy(id, p.prompt, e)}
                        className={`h-8 px-3 text-xs font-sans font-semibold border-0 transition-all ${
                          copiedId === id
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        }`}
                      >
                        {copiedId === id ? (
                          <>
                            <Check className="h-3.5 w-3.5 stroke-[3]" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" /> Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 3. BROWSE ALL PROMPTS & MULTI-DIMENSIONAL FILTERS ── */}
        <div className="space-y-8 text-left pt-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-display font-bold text-2xl text-foreground tracking-tight">
                Browse all prompts
              </h3>
              <span className="font-mono text-xs text-muted-foreground">
                Showing {filteredPrompts.length} prompt recipes
              </span>
            </div>

            {/* Filter Control Strip (Style, Model, Ratio, Sort) */}
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
              
              {/* Style / Category Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground mr-2 flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-primary" /> Style:
                </span>
                {STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition-all border ${
                      selectedStyle === style
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                        : 'bg-secondary text-muted-foreground border-border hover:text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>

              {/* Secondary Select Dropdowns: Model, Ratio, Sort */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
                
                {/* Model Selector */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground">Model:</span>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="bg-secondary border border-border text-foreground rounded-lg px-2.5 py-1 text-xs font-mono font-medium focus:outline-none focus:border-primary"
                  >
                    {MODELS.map((m) => (
                      <option key={m} value={m} className="bg-card text-foreground">
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Aspect Ratio Selector */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground">Ratio:</span>
                  <select
                    value={selectedRatio}
                    onChange={(e) => setSelectedRatio(e.target.value)}
                    className="bg-secondary border border-border text-foreground rounded-lg px-2.5 py-1 text-xs font-mono font-medium focus:outline-none focus:border-primary"
                  >
                    {RATIOS.map((r) => (
                      <option key={r} value={r} className="bg-card text-foreground">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By Selector */}
                <div className="flex items-center gap-2 ml-auto">
                  <span className="font-mono text-[11px] text-muted-foreground">Sort:</span>
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="bg-secondary border border-border text-foreground rounded-lg px-2.5 py-1 text-xs font-mono font-medium focus:outline-none focus:border-primary"
                  >
                    {SORTS.map((s) => (
                      <option key={s} value={s} className="bg-card text-foreground">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>
          </div>

          {/* ── Card Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((p, index) => {
              const id = p._id || p.id || `prompt-${index}`;
              const gradient = p.gradient || 'linear-gradient(135deg, #181424 0%, #38293d 50%, #FF6B4A 100%)';
              const frameTag = p.frameId || `CS·${101 + index}`;
              const aspectTag = p.aspectTag || (p.aspect ? `--ar ${p.aspect}` : '--ar 16:9');
              const imageUrl = p.image || p.imageUrl;

              return (
                <div
                  key={id}
                  onClick={() => setSelectedPrompt(p)}
                  className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1.5 hover:border-primary/70 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  {/* Artwork Image / Visual Preview Swatch */}
                  <div className="relative aspect-16/9 w-full bg-secondary overflow-hidden border-b border-border">
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
                        <span className="relative z-10 font-sans italic text-sm font-normal text-white tracking-widest lowercase select-none drop-shadow-md">
                          {p.category || 'artwork'}
                        </span>
                      </div>
                    )}

                    {/* Dark subtle overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Model tag overlay */}
                    <div className="absolute top-2.5 right-2.5 bg-background/85 backdrop-blur-xs border border-border px-2 py-0.5 rounded font-mono text-[9px] font-semibold text-emerald-600 dark:text-[#83E6C9] uppercase">
                      {p.aiModel || 'Midjourney'}
                    </div>

                    {/* Quick Inspect Hover Overlay */}
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                      <span className="font-sans text-xs font-semibold text-foreground flex items-center gap-1.5 bg-card px-3.5 py-1.5 rounded-lg border border-border shadow-md">
                        <Eye className="h-3.5 w-3.5 text-primary" /> Inspect Recipe
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                        <span className="text-emerald-600 dark:text-[#83E6C9] font-medium">{frameTag}</span>
                        <span>{aspectTag}</span>
                      </div>
                      <h4 className="font-display font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {p.title}
                      </h4>

                      {/* Code Syntax Block */}
                      <div className="bg-secondary/70 border border-border rounded-lg p-2.5">
                        <p className="font-mono text-[11px] leading-relaxed text-muted-foreground line-clamp-2 select-all">
                          {p.prompt}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-emerald-600 dark:text-[#83E6C9] font-medium truncate">
                        BY @{p.authorName?.toLowerCase().replace(/\s+/g, '_') || 'cinematic_art'}
                      </span>

                      <Button
                        size="sm"
                        onClick={(e) => handleCopy(id, p.prompt, e)}
                        className={`h-8 px-3 text-xs font-sans font-semibold border-0 transition-all ${
                          copiedId === id
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            : 'bg-primary hover:bg-primary/90 text-primary-foreground'
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
