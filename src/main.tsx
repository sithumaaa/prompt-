/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {fallbackPrompts} from './data/prompts-fallback';

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

const shuffledPrompts = shuffleArray(fallbackPrompts);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App initialPrompts={shuffledPrompts} />
  </StrictMode>,
);