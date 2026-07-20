/**
 * TopControls.js — date bar, theme toggle, search, archives button
 */
import { getState, setTheme, setState, subscribe } from '../store.js';
import { router } from '../router.js';

export function TopControls({ issue, onSearch }) {
  const el = document.createElement('div');
  el.className = 'top-controls';

  const state = getState();
  const isCyber = state.theme === 'cyber';

  const dateObj = new Date(issue.date + 'T12:00:00');
  const dateStr = dateObj.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  el.innerHTML = `
    <div class="metadata-left">
      <span>${issue.edition}</span>
      <span id="issue-date-display">${dateStr}</span>
      <span>${issue.scopeShort || 'Global'}</span>
    </div>
    <div class="control-panel">
      <button class="archives-btn" id="archives-open-btn">Archives ▾</button>
      <div class="theme-switch-wrapper">
        <span>Ink</span>
        <label class="theme-switch" for="theme-toggle">
          <input type="checkbox" id="theme-toggle" ${isCyber ? 'checked' : ''} />
          <div class="slider"></div>
        </label>
        <span>Terminal</span>
      </div>
      <div class="search-container">
        <input type="text" id="article-search" class="search-input" placeholder="Search articles…" />
      </div>
    </div>
  `;

  // Theme toggle
  el.querySelector('#theme-toggle').addEventListener('change', (e) => {
    setTheme(e.target.checked ? 'cyber' : 'paper');
  });

  // Search
  el.querySelector('#article-search').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    setState({ searchQuery: q });
    if (onSearch) onSearch(q);
  });

  // Archives
  el.querySelector('#archives-open-btn').addEventListener('click', () => {
    router.go('archives');
  });

  return el;
}
