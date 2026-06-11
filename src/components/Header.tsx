/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Heart, Compass, Home, Sparkles } from 'lucide-react';
import { ViewState } from '../types';

interface HeaderProps {
  view: ViewState;
  onSetView: (view: ViewState) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  favoritesCount: number;
}

export default function Header({
  view,
  onSetView,
  searchQuery,
  onSearchChange,
  favoritesCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-3 sm:flex-row sm:px-6 lg:px-8">
        
        {/* Left: Branding Logo */}
        <div 
          onClick={() => onSetView({ type: 'home' })}
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90 select-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-accent to-brand-accent-glow shadow-glow pulse-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight text-brand-text-primary">
              Prompt<span className="bg-gradient-to-r from-brand-accent-glow to-purple-400 bg-clip-text text-transparent">Vault</span>
            </span>
            <span className="block text-4xs font-mono tracking-wider uppercase text-brand-text-muted">
              AI Creative Library
            </span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="relative w-full max-w-md sm:mx-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-4.5 w-4.5 text-brand-text-secondary" />
          </div>
          <input
            type="text"
            id="search-input-header"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search prompt, style, tool, object..."
            className="w-full rounded-xl border border-brand-border bg-brand-surface py-2 pl-10 pr-4 text-xs font-medium text-brand-text-primary placeholder-brand-text-muted outline-none transition-all duration-200 focus:border-brand-accent/50 focus:bg-brand-card focus:shadow-glow focus:ring-1 focus:ring-brand-accent/30 sm:text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-text-secondary hover:text-brand-text-primary text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right: Dynamic Nav Actions */}
        <nav className="flex items-center gap-1.5 w-full justify-center sm:w-auto">
          {/* Home Button */}
          <button
            onClick={() => onSetView({ type: 'home' })}
            id="nav-home"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
              view.type === 'home'
                ? 'bg-brand-surface text-brand-accent-glow border border-brand-border'
                : 'text-brand-text-secondary hover:bg-brand-surface/30 hover:text-brand-text-primary border border-transparent'
            }`}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          {/* Categories Button */}
          <button
            onClick={() => onSetView({ type: 'category', category: '' })}
            id="nav-categories"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
              view.type === 'category'
                ? 'bg-brand-surface text-brand-accent-glow border border-brand-border'
                : 'text-brand-text-secondary hover:bg-brand-surface/30 hover:text-brand-text-primary border border-transparent'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Categories</span>
          </button>

          {/* Favorites Button with Badge */}
          <button
            onClick={() => onSetView({ type: 'favorites' })}
            id="nav-favorites"
            className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
              view.type === 'favorites'
                ? 'bg-brand-surface text-brand-accent-glow border border-brand-border'
                : 'text-brand-text-secondary hover:bg-brand-surface/30 hover:text-brand-text-primary border border-transparent'
            }`}
          >
            <Heart className={`h-4 w-4 ${favoritesCount > 0 ? 'text-red-500 fill-red-500/20' : ''}`} />
            <span>Favorites</span>
            
            {/* Favorites Count Badge */}
            {favoritesCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-4xs font-bold text-white shadow-sm ring-1 ring-brand-bg">
                {favoritesCount}
              </span>
            )}
          </button>
        </nav>

      </div>
    </header>
  );
}
