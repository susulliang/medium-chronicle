/**
 * TopControls.js — date bar, search, archives button
 */
import { setState } from '../store.js';
import { router } from '../router.js';

export function TopControls({ issue, onSearch }) {
  const el = document.createElement('div');
  el.className = 'top-controls';

  const dateObj = new Date(issue.date + 'T12:00:00');
  const dateStr = dateObj.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  el.innerHTML = `
    <div class="control-panel">
      <button class="archives-btn" id="archives-open-btn">Archives ▾</button>
      <div class="search-container">
        <input type="text" id="article-search" class="search-input" placeholder="Search articles…" />
      </div>
    </div>
    <div class="metadata-right">
      <span>${issue.edition}</span>
      <span id="issue-date-display">${dateStr}</span>
      <span>${issue.scopeShort || 'Global'}</span>
    </div>
  `;

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
