/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { PromptEntry } from '../types';
import { 
  ArrowLeft, Copy, Check, Heart, Sparkles, AlertCircle, 
  Eye, Calendar, Code, Laptop, HelpCircle, ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface PromptDetailProps {
  promptId: string;
  prompts: PromptEntry[];
  onBack: () => void;
  onViewPrompt: (id: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function PromptDetail({
  promptId,
  prompts,
  onBack,
  onViewPrompt,
  isFavorite,
  onToggleFavorite,
}: PromptDetailProps) {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Custom interactive playground state: replacing bracketed placeholders or custom replacement words
  const [customKeyword, setCustomKeyword] = useState('');
  const [selectedWordToReplace, setSelectedWordToReplace] = useState('');

  // Find the active prompt
  const item = useMemo(() => {
    return prompts.find((p) => p.id === promptId);
  }, [prompts, promptId]);

  // Find related prompts in the same category
  const relatedPrompts = useMemo(() => {
    if (!item) return [];
    return prompts
      .filter((p) => p.category === item.category && p.id !== item.id)
      .slice(0, 3);
  }, [prompts, item]);

  // Handle Copy Action
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!item) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center select-none">
        <AlertCircle className="mx-auto h-12 w-12 text-brand-text-muted" />
        <h2 className="mt-4 font-display text-xl font-bold text-brand-text-primary">
          Prompt Formula Not Found
        </h2>
        <p className="mt-2 text-xs text-brand-text-secondary">
          The requested asset key is invalid or has been modified.
        </p>
        <button
          onClick={onBack}
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-brand-accent px-4 py-2 text-xs font-semibold text-white hover:bg-brand-accent-glow cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Home
        </button>
      </div>
    );
  }

  // Precompute placeholder words for the prompt customizer
  // We can look for keywords inside the prompt or offer a list of words from tags to swap
  const customizerWords = useMemo(() => {
    // Break prompt by space and clean, filter nouns/adjectives that could be customizable
    const rawTokens = item.prompt.split(',').map(s => s.trim());
    return rawTokens.slice(0, 4).filter(Boolean);
  }, [item.prompt]);

  // Computed prompt text based on the interactive customizer
  const computedPrompt = useMemo(() => {
    if (!selectedWordToReplace || !customKeyword.trim()) {
      return item.prompt;
    }
    // Simple global case-insensitive replace of selected token
    return item.prompt.split(selectedWordToReplace).join(customKeyword.trim());
  }, [item.prompt, selectedWordToReplace, customKeyword]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Back Button Trigger */}
      <button
        onClick={onBack}
        id="btn-back-to-list"
        className="mb-6 inline-flex items-center gap-2 rounded-lg border border-brand-border bg-brand-surface/30 px-3.5 py-2 text-xs font-semibold text-brand-text-secondary cursor-pointer hover:bg-brand-surface hover:text-brand-text-primary transition-colors hover:border-brand-accent/25"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Prompts</span>
      </button>

      {/* Main Container Layout: 2-Column Split */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Column: Huge Visual Frame */}
        <div className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-2xl border border-brand-border bg-brand-card shadow-lg select-none aspect-4/3">
            {imageError ? (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-brand-tag-bg/40 via-brand-bg to-brand-bg p-8 text-center relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#2d2d3512_1px,transparent_1px),linear-gradient(to_bottom,#2d2d3512_1px,transparent_1px)] bg-[size:16px_16px]" />
                <Sparkles className="mb-4 h-12 w-12 text-brand-accent pulse-glow rounded-full p-2 bg-brand-accent/15" />
                <span className="font-display text-lg font-bold tracking-tight text-brand-text-primary uppercase">
                  {item.category} Visual
                </span>
                <span className="mt-2 max-w-md text-xs text-brand-text-secondary leading-relaxed px-4">
                  Image asset for prompt <code className="font-mono text-brand-accent-glow">#{item.id}</code> would be loaded at runtime if exists in static files directory.
                </span>
              </div>
            ) : (
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="h-full w-full object-cover"
              />
            )}
            
            {/* Engine badge overlay */}
            <div className="absolute bottom-4 left-4 rounded-full bg-brand-bg/90 px-3.5 py-1.5 text-xs font-semibold text-brand-text-primary border border-brand-border backdrop-blur-sm shadow flex items-center gap-1.5">
              <Laptop className="h-4 w-4 text-brand-accent-glow" />
              {item.tool}
            </div>

            {/* Favorite overlay button */}
            <button
              onClick={() => onToggleFavorite(item.id)}
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-bg/90 border border-brand-border text-brand-text-secondary backdrop-blur-sm transition-transform active:scale-90 hover:text-red-500 shadow"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
            </button>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-brand-text-secondary px-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-brand-accent/75" />
              Added: <strong>{item.date_added}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Code className="h-4 w-4 text-brand-accent/75" />
              ID Key: <strong>{item.id}</strong>
            </span>
          </div>
        </div>

        {/* Right Column: Prompt Details and Copy Playground */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            {/* Header tags and title */}
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded bg-brand-accent/15 px-3 py-1 text-2xs font-extrabold tracking-wider uppercase text-brand-accent-glow border border-brand-accent/25">
                {item.category}
              </span>
              {item.trending && (
                <span className="rounded bg-orange-500/10 px-3 py-1 text-2xs font-extrabold tracking-wider uppercase text-orange-400 border border-orange-500/15">
                  🔥 Trending Now
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl font-bold text-brand-text-primary sm:text-3xl leading-tight">
              {item.title}
            </h1>

            {/* Structured Tags Pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-brand-tag-bg/50 px-3 py-1 text-xs text-brand-accent-glow border border-brand-accent/10"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* The Code Copy Block Area */}
            <div className="mt-6 rounded-xl border border-brand-border bg-brand-surface p-5 relative group">
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="text-4xs font-mono tracking-wider uppercase text-brand-text-muted">
                  System Parameter
                </span>
              </div>
              
              <h3 className="text-3xs font-mono tracking-wider uppercase text-brand-accent-glow mb-2.5">
                Copyable Prompt Formula
              </h3>

              {/* Editable Output */}
              <p className="font-mono text-xs text-brand-text-primary select-all leading-relaxed whitespace-pre-wrap p-3.5 bg-brand-card/50 rounded-lg border border-brand-border max-h-[160px] overflow-y-auto">
                {computedPrompt}
              </p>

              {/* Dynamic Action Controls */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleCopy(computedPrompt)}
                  id="btn-copy-main-prompt"
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold select-none cursor-pointer shadow-md transition-all active:scale-98 ${
                    copied
                      ? 'bg-brand-success text-brand-bg font-extrabold shadow-glow'
                      : 'bg-brand-accent hover:bg-brand-accent-glow text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-4.5 w-4.5 stroke-[2.5]" />
                      <span>PROMPT COPIED TO CLIPBOARD!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4.5 w-4.5" />
                      <span>COPY ENTIRE PROMPT FORMULA</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Creative Playground Box */}
            <div className="mt-6 rounded-xl border border-brand-border/40 bg-brand-card/35 p-5">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Sparkles className="h-4 w-4 text-brand-accent-glow" />
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-brand-text-primary">
                  Interactive Tweak Playground
                </h4>
              </div>
              <p className="text-2xs text-brand-text-secondary leading-normal mb-4">
                Want to customize the styling? Select a key phrase from the prompt underneath, substitute your own idea, and watch the formula update instantly above in real time.
              </p>

              {/* Select Tweak Word */}
              <div className="mb-4">
                <label className="block text-3xs font-mono uppercase tracking-wider text-brand-text-muted mb-1.5">
                  1. Select a phrase to swap out:
                </label>
                <div className="flex flex-wrap gap-2">
                  {customizerWords.map((token) => (
                    <button
                      key={token}
                      onClick={() => {
                        setSelectedWordToReplace(token);
                        setCustomKeyword(token); // Prep with current word
                      }}
                      className={`px-3 py-1.5 rounded-lg text-2xs cursor-pointer border font-mono transition-all ${
                        selectedWordToReplace === token
                          ? 'bg-brand-accent/15 border-brand-accent text-brand-accent-glow font-bold'
                          : 'bg-brand-surface border-brand-border text-brand-text-secondary hover:text-brand-text-primary'
                      }`}
                    >
                      {token}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input custom word */}
              {selectedWordToReplace && (
                <div className="animate-fade-in">
                  <label className="block text-3xs font-mono uppercase tracking-wider text-brand-text-muted mb-1.5">
                    2. Type your new parameter concept:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customKeyword}
                      onChange={(e) => setCustomKeyword(e.target.value)}
                      placeholder={`Try typing a style, creature, color...`}
                      className="flex-1 rounded-lg border border-brand-border bg-brand-surface py-2 px-3 text-xs text-brand-text-primary outline-none focus:border-brand-accent/50 focus:shadow-glow focus:ring-1 focus:ring-brand-accent/30"
                    />
                    <button
                      onClick={() => {
                        setSelectedWordToReplace('');
                        setCustomKeyword('');
                      }}
                      className="px-3 rounded-lg border border-brand-border text-2xs text-brand-text-secondary hover:text-brand-text-primary cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Related Prompts Row */}
      <div className="mt-14 border-t border-brand-border pt-10 select-none">
        <h2 className="font-display text-lg font-bold text-brand-text-primary sm:text-xl flex items-center gap-1.5 mb-6">
          <HelpCircle className="h-5 w-5 text-brand-accent-glow" />
          More {item.category} Masterpieces
        </h2>
        
        {relatedPrompts.length === 0 ? (
          <p className="text-xs text-brand-text-muted italic px-2">
            No similar prompts currently catalogued. Sithum will add more soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {relatedPrompts.map((p) => (
              <div
                key={p.id}
                id={`related-card-${p.id}`}
                onClick={() => {
                  onViewPrompt(p.id);
                  // Scroll to top of the detail page so they can see it instantly
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setImageError(false);
                }}
                className="group cursor-pointer rounded-xl border border-brand-border bg-brand-card p-3.5 transition-all hover:border-brand-accent/30 hover:shadow-glow flex flex-col justify-between"
              >
                <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-lg bg-brand-bg">
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const div = document.createElement('div');
                        div.className = "flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-brand-tag-bg/40 via-brand-bg to-brand-bg p-4 text-center border border-brand-border/10";
                        div.innerHTML = `<span class="font-display text-3xs font-semibold tracking-wider text-brand-accent-glow uppercase">SUGGESTION</span>`;
                        parent.appendChild(div);
                      }
                    }}
                  />
                </div>
                <div>
                  <span className="text-5xs font-mono tracking-wider uppercase text-brand-accent-glow block mb-1">
                    {p.category}
                  </span>
                  <h3 className="font-display font-semibold text-xs text-brand-text-primary truncate">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-4xs text-brand-text-secondary line-clamp-1 italic">
                    "{p.prompt}"
                  </p>
                </div>
                <div className="mt-3.5 flex items-center justify-end text-3xs font-mono text-brand-accent hover:text-brand-accent-glow">
                  <span>Explore parameters</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
