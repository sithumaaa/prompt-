/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PromptEntry } from '../types';
import { Copy, Check, Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface PromptCardProps {
  key?: any;
  promptEntry: PromptEntry;
  onViewDetails: (id: string) => void;
  onCategoryClick: (category: string) => void;
  onTagClick: (tag: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e?: React.MouseEvent) => void;
}

export default function PromptCard({
  promptEntry,
  onViewDetails,
  onCategoryClick,
  onTagClick,
  isFavorite,
  onToggleFavorite,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(promptEntry.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Generate a gorgeous theme color based on the category
  const getCategoryGradients = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('cyberpunk')) {
      return 'from-teal-50 via-teal-100/30 to-brand-bg border-teal-200 text-teal-700';
    } else if (cat.includes('fantasy')) {
      return 'from-pink-50 via-purple-100/30 to-brand-bg border-pink-200 text-pink-700';
    } else if (cat.includes('sci-fi') || cat.includes('retro')) {
      return 'from-amber-50 via-amber-100/30 to-brand-bg border-amber-200 text-amber-700';
    } else if (cat.includes('architecture')) {
      return 'from-slate-100 via-slate-100/50 to-brand-bg border-slate-200 text-slate-700';
    } else if (cat.includes('portrait')) {
      return 'from-orange-50 via-orange-100/30 to-brand-bg border-orange-200 text-orange-700';
    } else {
      return 'from-indigo-50 via-indigo-100/30 to-brand-bg border-indigo-200 text-indigo-700';
    }
  };

  const getGradientBadge = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('cyberpunk')) return 'bg-teal-50 text-teal-700 border-teal-200';
    if (cat.includes('fantasy')) return 'bg-pink-50 text-pink-700 border-pink-200';
    if (cat.includes('sci-fi') || cat.includes('retro')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (cat.includes('architecture')) return 'bg-slate-100 text-slate-700 border-slate-200';
    if (cat.includes('portrait')) return 'bg-orange-50 text-orange-700 border-orange-200';
    return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  };

  const styleGradients = getCategoryGradients(promptEntry.category);
  const badgeStyle = getGradientBadge(promptEntry.category);

  return (
    <motion.div
      id={`prompt-card-${promptEntry.id}`}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-brand-border bg-brand-card transition-all duration-300 hover:border-brand-accent/50 hover:shadow-glow"
    >
      {/* Target Clickable Card Area */}
      <div 
        onClick={() => onViewDetails(promptEntry.id)}
        className="cursor-pointer"
      >
        {/* Sample Image Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-brand-bg select-none">
          {imageError ? (
            <div className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${styleGradients} p-4 text-center relative`}>
              {/* Pattern Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#2d2d3515_1px,transparent_1px),linear-gradient(to_bottom,#2d2d3515_1px,transparent_1px)] bg-[size:14px_14px]" />
              <div className="relative z-10 flex flex-col items-center">
                <Sparkles className="mb-2 h-7 w-7 opacity-80" />
                <span className="font-display text-sm font-semibold tracking-wider uppercase opacity-50">
                  {promptEntry.category} Visual
                </span>
                <span className="mt-1 max-w-[80%] text-xs font-mono text-brand-text-secondary/70 line-clamp-1 italic px-2">
                  "{promptEntry.title}"
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Gradient Loading Shimmer Background */}
              <div className="absolute inset-0 shimmer z-0" />
              
              <img
                src={promptEntry.image}
                alt={promptEntry.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="relative z-10 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Card Hover Darkening Vignette */}
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-brand-bg via-transparent to-transparent opacity-60" />
            </>
          )}

          {/* Prompt Engine Logo Tag overlay */}
          <div className="absolute top-3 left-3 z-30">
            <span className="rounded-full bg-brand-bg/90 px-3 py-1 text-2xs font-medium text-brand-text-primary backdrop-blur-md border border-brand-border flex items-center gap-1 shadow-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent" />
              {promptEntry.tool}
            </span>
          </div>

          {/* Favorite heart button overlay */}
          <button
            onClick={(e) => onToggleFavorite(promptEntry.id, e)}
            className="absolute top-3 right-3 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-brand-bg/90 text-brand-text-secondary border border-brand-border backdrop-blur-md transition-colors hover:text-red-500 active:scale-95 shadow-sm"
          >
            <Heart className={`h-4 w-4 transition-transform duration-300 ${isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'hover:scale-115'}`} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Category Pillar */}
          <div className="mb-2 flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCategoryClick(promptEntry.category);
              }}
              className={`rounded px-2.5 py-0.5 text-3xs font-semibold tracking-wider uppercase border ${badgeStyle} transition-colors`}
            >
              {promptEntry.category}
            </button>
            <span className="text-3xs font-mono text-brand-text-secondary/50">
              {promptEntry.date_added}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display text-base font-semibold leading-snug text-brand-text-primary group-hover:text-brand-accent-glow transition-colors line-clamp-1">
            {promptEntry.title}
          </h3>

          {/* Prompt Excerpt */}
          <p className="mt-2.5 min-h-[48px] text-xs leading-relaxed text-brand-text-secondary line-clamp-2 select-none">
            {promptEntry.prompt}
          </p>
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="px-5 pb-5 pt-1">
        {/* Interactive Tags Row */}
        <div className="mb-4 flex flex-wrap gap-1.5 overflow-hidden max-h-[22px]">
          {promptEntry.tags.slice(0, 3).map((tag) => (
            <button
              key={tag}
              id={`tag-${promptEntry.id}-${tag}`}
              onClick={(e) => {
                e.stopPropagation();
                onTagClick(tag);
              }}
              className="rounded-full bg-brand-tag-bg/50 px-2.5 py-0.5 text-3xs text-brand-accent-glow border border-brand-accent/10 hover:bg-brand-tag-bg hover:border-brand-accent-glow/30 transition-all cursor-pointer font-medium"
            >
              #{tag}
            </button>
          ))}
          {promptEntry.tags.length > 3 && (
            <span className="text-3xs text-brand-text-muted px-1 self-center">
              +{promptEntry.tags.length - 3}
            </span>
          )}
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={handleCopy}
            id={`btn-copy-${promptEntry.id}`}
            className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium cursor-pointer transition-all duration-200 select-none ${
              copied
                ? 'bg-brand-success/15 text-brand-success border-brand-success/30'
                : 'bg-brand-surface border-brand-border text-brand-text-primary hover:bg-brand-border hover:border-brand-accent-glow/20'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>

          <button
            onClick={() => onViewDetails(promptEntry.id)}
            id={`btn-view-${promptEntry.id}`}
            className="flex items-center justify-center gap-1 rounded-lg bg-brand-accent px-3 py-2 text-xs font-semibold cursor-pointer text-white hover:bg-brand-accent-glow transition-all active:scale-97 shadow-md"
          >
            <span>View Detail</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
