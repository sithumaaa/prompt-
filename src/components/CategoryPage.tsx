/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { PromptEntry } from '../types';
import { Compass, Sparkles, Filter, ChevronRight, SlidersHorizontal, Info } from 'lucide-react';
import PromptCard from './PromptCard';

interface CategoryPageProps {
  prompts: PromptEntry[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onViewDetails: (id: string) => void;
  onTagClick: (tag: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e?: React.MouseEvent) => void;
}

export default function CategoryPage({
  prompts,
  selectedCategory,
  onSelectCategory,
  onViewDetails,
  onTagClick,
  favorites,
  onToggleFavorite,
}: CategoryPageProps) {
  
  // Extract all unique categories dynamically
  const categoriesList = useMemo(() => {
    const list = prompts.map((p) => p.category);
    // Unique list
    return Array.from(new Set(list));
  }, [prompts]);

  // Filter prompts by active category
  const filteredPrompts = useMemo(() => {
    if (!selectedCategory) {
      // If no category selected, show all in a nice combined browse view
      return prompts;
    }
    return prompts.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [prompts, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 select-none">
      
      {/* Title Header bar */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-brand-border/40 pb-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400 border border-violet-500/10 shadow-glow">
            <Compass className="h-4.5 w-4.5" />
          </div>
          <div>
            <h1 className="font-display text-xl font-extrabold text-brand-text-primary sm:text-2xl">
              Category Stylizer Vault
            </h1>
            <p className="text-3xs font-mono tracking-wider uppercase text-brand-text-muted mt-0.5">
              Browse prompt frameworks by artistic discipline
            </p>
          </div>
        </div>

        {selectedCategory && (
          <div className="flex items-center gap-1.5 rounded-lg bg-brand-accent/5 px-3 py-1.5 text-2xs font-semibold text-brand-accent-glow border border-brand-accent/15 self-start">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Currently Active: <strong>{selectedCategory}</strong> ({filteredPrompts.length})</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Column: Sidebar Category Selector Navigation */}
        <aside className="lg:col-span-3 flex flex-col gap-5">
          <div className="rounded-xl border border-brand-border bg-brand-card p-4">
            <div className="mb-4 flex items-center gap-2 border-b border-brand-border/40 pb-3">
              <SlidersHorizontal className="h-4 w-4 text-brand-text-secondary" />
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-brand-text-primary">
                Art Domains
              </h3>
            </div>
            
            <div className="flex flex-col gap-1.5">
              {/* "All" Category Trigger */}
              <button
                onClick={() => onSelectCategory('')}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer text-left transition-all ${
                  !selectedCategory
                    ? 'bg-brand-accent text-white font-bold'
                    : 'text-brand-text-secondary hover:bg-brand-surface/55 hover:text-brand-text-primary'
                }`}
              >
                <span>All Categories</span>
                <span className={`text-3xs font-mono px-1.5 py-0.5 rounded-full ${!selectedCategory ? 'bg-brand-bg/45 text-white' : 'bg-brand-surface text-brand-text-muted'}`}>
                  {prompts.length}
                </span>
              </button>

              {/* Dynamic categories mapping */}
              {categoriesList.map((cat) => {
                const count = prompts.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer text-left transition-all ${
                      selectedCategory === cat
                        ? 'bg-brand-accent text-white font-bold'
                        : 'text-brand-text-secondary hover:bg-brand-surface/55 hover:text-brand-text-primary'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-3xs font-mono px-1.5 py-0.5 rounded-full ${selectedCategory === cat ? 'bg-brand-bg/45 text-white' : 'bg-brand-surface text-brand-text-muted'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-brand-border bg-brand-surface/20 p-4 text-xs text-brand-text-secondary">
            <div className="flex items-start gap-1.5">
              <Info className="h-4.5 w-4.5 text-brand-accent-glow shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Selecting a domain adjusts our dynamic algorithm. Sithum updates <code className="font-mono text-brand-accent-glow">prompts.json</code> to categorize and expand these filters continually.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Column: Responsive Prompts Grid */}
        <main className="lg:col-span-9">
          {filteredPrompts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-brand-border bg-brand-card/25 p-16 text-center">
              <Compass className="mx-auto h-12 w-12 text-brand-text-muted animate-pulse" />
              <h3 className="mt-4 font-display text-base font-bold text-brand-text-primary">
                No Parameters Categorized Yet
              </h3>
              <p className="mt-2 text-xs text-brand-text-secondary max-w-sm mx-auto">
                No creative instructions match the criteria. Adjust the sidebar selectors to review other themes!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              {filteredPrompts.map((p) => (
                <PromptCard
                  key={p.id}
                  promptEntry={p}
                  onViewDetails={onViewDetails}
                  onCategoryClick={onSelectCategory}
                  onTagClick={onTagClick}
                  isFavorite={favorites.includes(p.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </main>

      </div>

    </div>
  );
}
