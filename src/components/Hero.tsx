/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Flame, Sparkles, Wand2 } from 'lucide-react';

interface HeroProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectTag: (tag: string) => void;
  totalPromptsCount: number;
}

export default function Hero({
  categories,
  activeCategory,
  onSelectCategory,
  onSelectTag,
  totalPromptsCount,
}: HeroProps) {
  const trendingTags = [
    'cinematic',
    'photorealistic',
    'retro-futurism',
    'illustration',
    'minimalism',
    'ghibli',
    'portrait',
    '3d render',
  ];

  return (
    <div className="relative overflow-hidden border-b border-brand-border bg-gradient-to-b from-brand-accent/5 via-transparent to-transparent py-14 sm:py-20 select-none">
      
      {/* Background visual geometric accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e08_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e08_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute -top-40 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-accent/15 blur-3xl" />
      <div className="absolute top-1/3 right-[10%] -z-10 h-40 w-40 rounded-full bg-brand-accent-glow/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-accent/20 bg-brand-accent/5 px-3 py-1 text-4xs font-semibold tracking-wider uppercase text-brand-accent-glow shadow-sm mb-6">
          <Flame className="h-3 w-3 animate-pulse" />
          <span>Curated AI Imagery Engine — {totalPromptsCount} Active Prompts</span>
        </div>

        {/* Huge display headline */}
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-brand-text-primary sm:text-5xl md:text-6xl max-w-3xl mx-auto leading-[1.1]">
          Find the Perfect <br />
          <span className="bg-gradient-to-r from-brand-accent to-brand-accent-glow bg-clip-text text-transparent">
            AI Image Prompt
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-5 max-w-lg text-sm text-brand-text-secondary sm:text-base md:text-lg font-medium leading-relaxed">
          Discover, copy, and modify high-performance, viral prompt formulas for Midjourney, DALL-E, Stable Diffusion, and beyond.
        </p>

        {/* Tag Cloud Title */}
        <div className="mt-10 flex flex-wrap justify-center items-center gap-2 max-w-2xl mx-auto">
          <span className="text-3xs font-mono tracking-wider uppercase text-brand-text-muted flex items-center gap-1 mr-2">
            <Wand2 className="h-3.5 w-3.5 text-brand-accent" /> Filter Styles:
          </span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              id={`hero-tag-${tag}`}
              onClick={() => onSelectTag(tag)}
              className="rounded-full bg-brand-surface/40 hover:bg-brand-surface border border-brand-border px-3 py-1.5 text-xs text-brand-text-secondary hover:text-brand-text-primary transition-all cursor-pointer font-medium active:scale-95 hover:border-brand-accent/25"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Primary Categories Row */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-2 max-w-4xl mx-auto border-t border-brand-border/30 pt-5">
          <span className="text-3xs font-mono tracking-wider uppercase text-brand-text-muted flex items-center gap-1 mr-2">
            Categories:
          </span>
          <button
            onClick={() => onSelectCategory('')}
            className={`rounded-full px-3.5 py-1 text-xs font-semibold cursor-pointer transition-all ${
              !activeCategory 
                ? 'bg-brand-accent text-white shadow-shadow-glow' 
                : 'bg-brand-surface/50 text-brand-text-secondary hover:bg-brand-surface border border-brand-border'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              id={`hero-cat-${cat}`}
              onClick={() => onSelectCategory(cat)}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold cursor-pointer transition-all ${
                activeCategory === cat
                  ? 'bg-brand-accent text-white shadow-shadow-glow'
                  : 'bg-brand-surface/50 text-brand-text-secondary hover:bg-brand-surface border border-brand-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
