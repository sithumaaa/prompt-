/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { PromptEntry } from '../types';
import { Flame, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface TrendingProps {
  prompts: PromptEntry[];
  onViewDetails: (id: string) => void;
}

export default function TrendingRow({ prompts, onViewDetails }: TrendingProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 300 : scrollLeft + 300;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleCopy = (promptText: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(promptText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const trendingPrompts = prompts.filter((p) => p.trending);

  if (trendingPrompts.length === 0) return null;

  return (
    <div className="border-b border-brand-border bg-brand-card/20 py-10 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title & Navigation Controls Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/15 text-orange-500 border border-orange-500/10">
              <Flame className="h-4 w-4 animate-bounce" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-brand-text-primary sm:text-xl">
                Trending Prompt Formulas
              </h2>
              <p className="text-3xs font-mono tracking-wider uppercase text-brand-text-muted mt-0.5">
                Highly viral parameters of the week
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-brand-border bg-brand-surface text-brand-text-secondary hover:text-brand-text-primary hover:border-brand-accent/30 transition-colors"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-brand-border bg-brand-surface text-brand-text-secondary hover:text-brand-text-primary hover:border-brand-accent/30 transition-colors"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Swipeable Carousel Row */}
        <div
          ref={rowRef}
          className="no-scrollbar flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {trendingPrompts.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ y: -2 }}
              onClick={() => onViewDetails(p.id)}
              className="relative w-[280px] shrink-0 cursor-pointer rounded-xl border border-brand-border bg-brand-card p-4 transition-all hover:border-brand-accent/30 snap-start flex flex-col justify-between"
            >
              {/* Card visual backdrop/image preview */}
              <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg bg-brand-bg select-none">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    // Fallback to a solid styling on error
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const div = document.createElement('div');
                      div.className = "flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-brand-tag-bg/40 via-brand-bg to-brand-bg p-4 text-center border border-brand-border/10";
                      div.innerHTML = `<span class="font-display text-xs font-semibold tracking-wider text-brand-accent-glow uppercase">TRENDING</span>`;
                      parent.appendChild(div);
                    }
                  }}
                />
                <span className="absolute bottom-2 left-2 rounded-md bg-brand-bg/85 px-2 py-0.5 text-4xs font-semibold uppercase tracking-wider text-brand-text-primary shadow border border-brand-border">
                  {p.tool}
                </span>
              </div>

              {/* Title & category */}
              <div>
                <span className="text-4xs font-mono tracking-wider uppercase text-brand-accent-glow block mb-1">
                  {p.category}
                </span>
                <h3 className="font-display font-bold text-sm text-brand-text-primary truncate">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-2xs leading-normal text-brand-text-secondary line-clamp-2">
                  {p.prompt}
                </p>
              </div>

              {/* Fast action bottom row */}
              <div className="flex gap-2.5 mt-4">
                <button
                  onClick={(e) => handleCopy(p.prompt, p.id, e)}
                  className={`w-full py-1.5 rounded text-4xs font-semibold cursor-pointer transition-colors border select-none ${
                    copiedId === p.id
                      ? 'bg-brand-success/15 text-brand-success border-brand-success/20'
                      : 'bg-brand-surface border-brand-outline text-brand-text-primary hover:bg-brand-border'
                  }`}
                >
                  {copiedId === p.id ? 'Copied' : 'Fast Copy'}
                </button>
                <button
                  onClick={() => onViewDetails(p.id)}
                  className="w-full bg-brand-accent hover:bg-brand-accent-glow py-1.5 rounded text-4xs text-white font-bold cursor-pointer transition-colors"
                >
                  Detail
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
