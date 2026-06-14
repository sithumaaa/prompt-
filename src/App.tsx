/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ViewState, PromptEntry } from './types';
import { fallbackPrompts } from './data/prompts-fallback';
import { 
  Compass, Heart, Flame, Sparkles, Mail, Github, ExternalLink, 
  Trash2, FilterX, HelpCircle, Laptop, GraduationCap
} from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import TrendingRow from './components/TrendingRow';
import PromptCard from './components/PromptCard';
import PromptDetail from './components/PromptDetail';
import CategoryPage from './components/CategoryPage';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Fisher-Yates shuffle algorithm.
 * Returns a new shuffled copy of the array without mutating the original.
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface AppProps {
  initialPrompts: PromptEntry[];
}

export default function App({ initialPrompts }: AppProps) {
  // Real-time prompts list (populated from JSON or fallback), shuffled on initial load
  const [prompts, setPrompts] = useState<PromptEntry[]>(initialPrompts);
  const [loading, setLoading] = useState(true);

  // Active view state
  const [view, setView] = useState<ViewState>({ type: 'home' });

  // Real-time search query
  const [searchQuery, setSearchQuery] = useState('');

  // Active category filter on homepage list
  const [activeCategory, setActiveCategory] = useState('');

  // Bookmarks array (prompt IDs)
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Dynamic submission form visibility
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // New prompt draft state
  const [newTitle, setNewTitle] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [newCategory, setNewCategory] = useState('Cyberpunk');
  const [newTool, setNewTool] = useState('Midjourney v6');

  // Load Bookmarks and check URL on initial boot
  useEffect(() => {
    // 1. Fetch saved bookmarks
    try {
      const stored = localStorage.getItem('prompt_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (err) {
      console.warn('Could not read localStorage favorites: ', err);
    }

    // 2. Fetch master JSON dynamically
    const fetchMasterData = async () => {
      try {
        const response = await fetch('./data/prompts.json');
        if (response.ok) {
          const fetchedList = await response.json();
          if (Array.isArray(fetchedList) && fetchedList.length > 0) {
            setPrompts(shuffleArray(fetchedList));
          }
        }
      } catch (err) {
        console.warn('Dynamically reading master prompts.json failed; utilizing standalone fallbacks.', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMasterData();

    // 3. Scan URL search queries on mount
    const searchParams = new URLSearchParams(window.location.search);
    const idParam = searchParams.get('id');
    const catParam = searchParams.get('cat');
    const viewParam = searchParams.get('view');

    if (idParam) {
      setView({ type: 'prompt', id: idParam });
    } else if (catParam) {
      setView({ type: 'category', category: catParam });
    } else if (viewParam === 'favorites') {
      setView({ type: 'favorites' });
    } else if (viewParam === 'categories') {
      setView({ type: 'category', category: '' });
    }
  }, []);

  // Synchronize favorites array with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('prompt_favorites', JSON.stringify(favorites));
    } catch (err) {
      console.warn('Could not save favorites to localStorage: ', err);
    }
  }, [favorites]);

  // Synchronize View State to active browser URL search parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (view.type === 'prompt') {
      params.set('id', view.id);
    } else if (view.type === 'category') {
      if (view.category) {
        params.set('cat', view.category);
      } else {
        params.set('view', 'categories');
      }
    } else if (view.type === 'favorites') {
      params.set('view', 'favorites');
    }
    const queryString = params.toString();
    const targetUrl = queryString ? `?${queryString}` : window.location.pathname;
    window.history.pushState(null, '', targetUrl);
  }, [view]);

  // Listen to browser forward/back buttons and update View state
  useEffect(() => {
    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const idParam = searchParams.get('id');
      const catParam = searchParams.get('cat');
      const viewParam = searchParams.get('view');

      if (idParam) {
        setView({ type: 'prompt', id: idParam });
      } else if (catParam) {
        setView({ type: 'category', category: catParam });
      } else if (viewParam === 'favorites') {
        setView({ type: 'favorites' });
      } else if (viewParam === 'categories') {
        setView({ type: 'category', category: '' });
      } else {
        setView({ type: 'home' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Add or remove bookmarks
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Compile individual category lists dynamically
  const categoriesList = useMemo(() => {
    return Array.from(new Set(prompts.map((p) => p.category)));
  }, [prompts]);

  // Handle Home Screen Filters (Category and Search query)
  const filteredPrompts = useMemo(() => {
    let result = [...prompts];

    // 1. Search Query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.prompt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tool.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // 2. Category filter
    if (activeCategory) {
      result = result.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Sort: newest compiled first
    return result.sort(
      (a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime()
    );
  }, [prompts, searchQuery, activeCategory]);

  // Handle Favorites subset
  const favoritedPromptsList = useMemo(() => {
    return prompts.filter((p) => favorites.includes(p.id));
  }, [prompts, favorites]);

  // Clean all bookmarks
  const clearAllFavorites = () => {
    if (window.confirm('Do you want to clear your saved favorites collection?')) {
      setFavorites([]);
    }
  };

  // Navigate to single prompt details and scroll to top
  const handleViewDetails = (id: string) => {
    setView({ type: 'prompt', id });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Handle clicking search pills or tag pills
  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setView({ type: 'home' });
    setActiveCategory('');
    window.scrollTo({ top: 400, behavior: 'smooth' }); // Scroll past hero to results grid
  };

  // Home Screen category selection
  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setView({ type: 'home' });
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Handle form prompt submission (simulation corresponding to Section 10 Future Features)
  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrompt.trim()) return;

    // Standard draft creation: simulation of appending to submissions queue
    console.log('Sending submission draft: ', { newTitle, newPrompt, newCategory, newTool });
    setSubmitSuccess(true);
    setNewTitle('');
    setNewPrompt('');
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowSubmitModal(false);
    }, 2500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg text-brand-text-primary antialiased">
      
      {/* Sticky Header */}
      <Header
        view={view}
        onSetView={setView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoritesCount={favorites.length}
      />

      {/* Main Sections Body */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {view.type === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Dynamic Hero banner */}
              <Hero
                categories={categoriesList}
                activeCategory={activeCategory}
                onSelectCategory={handleCategorySelect}
                onSelectTag={handleTagClick}
                totalPromptsCount={prompts.length}
              />

              {/* Dynamic Horizontal swipe trending carousel */}
              {!searchQuery && !activeCategory && (
                <TrendingRow prompts={prompts} onViewDetails={handleViewDetails} />
              )}

              {/* Grid Section of catalogued prompts */}
              <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                
                {/* Section header meta stats */}
                <div className="mb-8 flex flex-col justify-between gap-4 border-b border-brand-border/40 pb-5 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="font-display text-xl font-bold text-brand-text-primary">
                      {activeCategory ? `${activeCategory} Collection` : 'All Creative Prompts'}
                    </h2>
                    <p className="text-3xs font-mono tracking-wider uppercase text-brand-text-muted mt-0.5">
                      Showing {filteredPrompts.length} of {prompts.length} compiled filters
                    </p>
                  </div>
                  
                  {/* Reset Filters pills when filters are active */}
                  {(searchQuery || activeCategory) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('');
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-brand-accent/25 bg-brand-accent/5 px-3 py-1.5 text-2xs font-bold text-brand-accent-glow cursor-pointer hover:bg-brand-accent/15 transition-all"
                    >
                      <FilterX className="h-4 w-4" />
                      <span>Clear Active Filters</span>
                    </button>
                  )}
                </div>

                {/* Grid Results container */}
                {filteredPrompts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-brand-border bg-brand-card/25 p-16 text-center shadow-inner">
                    <Compass className="mx-auto h-12 w-12 text-brand-text-muted animate-pulse" />
                    <h3 className="mt-4 font-display text-base font-bold text-brand-text-primary">
                      No Creative Formulas Found
                    </h3>
                    <p className="mt-2 text-xs text-brand-text-secondary max-w-sm mx-auto">
                      No prompts match current parameters <span className="font-semibold text-brand-accent-glow">"{searchQuery}"</span>. Try broadening the search criteria.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredPrompts.map((p) => (
                      <PromptCard
                        key={p.id}
                        promptEntry={p}
                        onViewDetails={handleViewDetails}
                        onCategoryClick={(cat) => setView({ type: 'category', category: cat })}
                        onTagClick={handleTagClick}
                        isFavorite={favorites.includes(p.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                )}

              </div>
            </motion.div>
          )}

          {view.type === 'prompt' && (
            <motion.div
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <PromptDetail
                promptId={view.id}
                prompts={prompts}
                onBack={() => setView({ type: 'home' })}
                onViewPrompt={handleViewDetails}
                isFavorite={favorites.includes(view.id)}
                onToggleFavorite={(id) => toggleFavorite(id)}
              />
            </motion.div>
          )}

          {view.type === 'category' && (
            <motion.div
              key="category"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <CategoryPage
                prompts={prompts}
                selectedCategory={view.category}
                onSelectCategory={(cat) => setView({ type: 'category', category: cat })}
                onViewDetails={handleViewDetails}
                onTagClick={handleTagClick}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            </motion.div>
          )}

          {view.type === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
            >
              {/* Favorites Title Bar */}
              <div className="mb-8 flex flex-col justify-between gap-4 border-b border-brand-border/40 pb-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 text-red-500 border border-red-500/10 shadow-glow">
                    <Heart className="h-4.5 w-4.5 fill-red-500" />
                  </div>
                  <div>
                    <h1 className="font-display text-xl font-extrabold text-brand-text-primary sm:text-2xl">
                      My Favorites Collection
                    </h1>
                    <p className="text-3xs font-mono tracking-wider uppercase text-brand-text-muted mt-0.5">
                      Your saved high-performance parameters
                    </p>
                  </div>
                </div>

                {favorites.length > 0 && (
                  <button
                    onClick={clearAllFavorites}
                    id="btn-clear-all-favorites"
                    className="flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 cursor-pointer self-start sm:self-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear Collection</span>
                  </button>
                )}
              </div>

              {/* Favorites Grid */}
              {favoritedPromptsList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-brand-border bg-brand-card/25 p-16 text-center">
                  <Heart className="mx-auto h-12 w-12 text-brand-text-muted animate-pulse" />
                  <h3 className="mt-4 font-display text-base font-bold text-brand-text-primary">
                    Collection is Currently Empty
                  </h3>
                  <p className="mt-2 text-xs text-brand-text-secondary max-w-sm mx-auto">
                    No prompt formulas saved. Browse our creative vaults and tap the heart icon on any card to populate feedback list!
                  </p>
                  <button
                    onClick={() => setView({ type: 'home' })}
                    className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-brand-accent px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-accent-glow cursor-pointer"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {favoritedPromptsList.map((p) => (
                    <PromptCard
                      key={p.id}
                      promptEntry={p}
                      onViewDetails={handleViewDetails}
                      onCategoryClick={(cat) => setView({ type: 'category', category: cat })}
                      onTagClick={handleTagClick}
                      isFavorite={true}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Website Footer Area */}
      <footer className="border-t border-brand-border bg-brand-card/30 mt-16 py-12 select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            
            {/* Brand block */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent text-white shadow">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="font-display text-lg font-bold tracking-tight text-brand-text-primary">
                  Prompt<span className="text-brand-accent-glow">Vault</span>
                </span>
              </div>
              <p className="mt-4 text-xs text-brand-text-secondary leading-relaxed max-w-xs">
                A highly-polished open-catalogue library built to aid designers in discovering and copying the most powerful generative parameters.
              </p>
              <span className="block mt-6 text-3xs font-mono text-brand-text-muted">
                © 2026 PromptVault. Managed by Sithum. All rights reserved.
              </span>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-brand-text-primary">
                Parameters Guides
              </h4>
              <ul className="mt-4 space-y-2 text-xs text-brand-text-secondary">
                <li>
                  <button onClick={() => setView({ type: 'category', category: 'Cyberpunk' })} className="hover:text-brand-accent-glow transition-colors cursor-pointer">
                    Cyberpunk Settings
                  </button>
                </li>
                <li>
                  <button onClick={() => setView({ type: 'category', category: 'Fantasy' })} className="hover:text-brand-accent-glow transition-colors cursor-pointer">
                    Fantasy Watercolor Illustrations
                  </button>
                </li>
                <li>
                  <button onClick={() => setView({ type: 'category', category: 'Architecture' })} className="hover:text-brand-accent-glow transition-colors cursor-pointer">
                    Brutalist Architectural Renders
                  </button>
                </li>
                <li>
                  <button onClick={() => setView({ type: 'category', category: 'Portrait' })} className="hover:text-brand-accent-glow transition-colors cursor-pointer">
                    Analog Film Portraits
                  </button>
                </li>
              </ul>
            </div>

            {/* AI Engines info */}
            <div className="md:col-span-2">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-brand-text-primary">
                Engines Catalogued
              </h4>
              <ul className="mt-4 space-y-2 text-xs text-brand-text-secondary font-medium">
                <li className="flex items-center gap-1.5">
                  <Laptop className="h-3.5 w-3.5 text-brand-text-muted" />
                  <span>Midjourney v6</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Laptop className="h-3.5 w-3.5 text-brand-text-muted" />
                  <span>DALL-E 3</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Laptop className="h-3.5 w-3.5 text-brand-text-muted" />
                  <span>Stable Diffusion XL</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Laptop className="h-3.5 w-3.5 text-brand-text-muted" />
                  <span>Adobe Firefly</span>
                </li>
              </ul>
            </div>

            {/* Submit Block */}
            <div className="md:col-span-3">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-brand-text-primary">
                Contribute Formula
              </h4>
              <p className="mt-4 text-xs text-brand-text-secondary leading-relaxed">
                Discovered an incredible design style or trending parameter? Suggest it to Sithum's queue!
              </p>
              <div className="mt-4">
                <button
                  onClick={() => setShowSubmitModal(true)}
                  id="btn-footer-suggest"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-surface px-4 py-2.5 text-xs font-semibold text-brand-text-primary border border-brand-border hover:border-brand-accent/30 cursor-pointer hover:bg-brand-border transition-all w-full justify-center"
                >
                  <Mail className="h-4 w-4 text-brand-accent-glow" />
                  <span>Submit Prompt Idea</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </footer>

      {/* Suggest Submissions Pop-up Drawer (Fulfillment of Section 10 submission Form) */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-brand-border bg-brand-card p-6 shadow-glow"
            >
              <h3 className="font-display text-base font-bold text-brand-text-primary flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-brand-accent-glow" />
                Submit Creative Prompt Formula
              </h3>
              <p className="text-3xs text-brand-text-secondary leading-normal mb-5 border-b border-brand-border/40 pb-3">
                Your prompt will be processed for verification and appended securely into <code className="font-mono text-brand-accent-glow">prompts.json</code>.
              </p>

              {submitSuccess ? (
                <div className="py-8 text-center animate-fade-in">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-success/15 text-brand-success mb-3 border border-brand-success/20">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                  <h4 className="font-display text-sm font-bold text-brand-text-primary">
                    Idea Received Successfully!
                  </h4>
                  <p className="mt-1.5 text-3xs text-brand-text-secondary max-w-xs mx-auto leading-relaxed">
                    Thank you. Sithum will review the design parameter and synchronize it in the next static deployment batch!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitPrompt} className="space-y-4">
                  <div>
                    <label className="block text-4xs font-mono uppercase tracking-wider text-brand-text-muted mb-1.5">
                      Prompt Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Dreamy Cybernetic Cat"
                      className="w-full rounded-lg border border-brand-border bg-brand-surface py-2 px-3 text-xs text-brand-text-primary placeholder-brand-text-muted outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/25"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-4xs font-mono uppercase tracking-wider text-brand-text-muted mb-1.5">
                        Art Category
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full rounded-lg border border-brand-border bg-brand-surface py-2 px-2 text-xs text-brand-text-primary outline-none focus:border-brand-accent/50"
                      >
                        <option value="Cyberpunk">Cyberpunk</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                        <option value="Portrait">Portrait</option>
                        <option value="Anime">Anime</option>
                        <option value="Architecture">Architecture</option>
                        <option value="Retro">Retro</option>
                        <option value="Nature">Nature</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-4xs font-mono uppercase tracking-wider text-brand-text-muted mb-1.5">
                        Target Engine Selection
                      </label>
                      <select
                        value={newTool}
                        onChange={(e) => setNewTool(e.target.value)}
                        className="w-full rounded-lg border border-brand-border bg-brand-surface py-2 px-2 text-xs text-brand-text-primary outline-none focus:border-brand-accent/50"
                      >
                        <option value="Midjourney v6">Midjourney v6</option>
                        <option value="DALL-E 3">DALL-E 3</option>
                        <option value="Stable Diffusion XL">Stable Diffusion XL</option>
                        <option value="Adobe Firefly">Adobe Firefly</option>
                        <option value="Ideogram 2.0">Ideogram 2.0</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-4xs font-mono uppercase tracking-wider text-brand-text-muted mb-1.5">
                      Prompt Command Content *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newPrompt}
                      onChange={(e) => setNewPrompt(e.target.value)}
                      placeholder="Paste instructions, modifiers, aspects, render resolutions..."
                      className="w-full rounded-lg border border-brand-border bg-brand-surface py-2 px-3 text-xs text-brand-text-primary placeholder-brand-text-muted outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/25 resize-none"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="rounded-lg border border-brand-border px-4 py-2 text-xs font-semibold text-brand-text-secondary hover:text-brand-text-primary cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-brand-accent hover:bg-brand-accent-glow px-4 py-2 text-xs font-semibold text-white cursor-pointer active:scale-95"
                    >
                      Submit Draft
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
