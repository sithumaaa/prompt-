/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PromptEntry {
  id: string;
  title: string;
  prompt: string;
  tool: string;
  category: string;
  tags: string[];
  trending: boolean;
  image: string;
  date_added: string;
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'prompt'; id: string }
  | { type: 'category'; category: string }
  | { type: 'favorites' };
