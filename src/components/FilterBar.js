/**
 * FilterBar.js — content-type filter pills
 */
import { setState } from '../store.js';

const ALL_TYPES = [
  { key: 'all',      label: 'All Articles' },
  { key: 'festival', label: 'Festivals & Events' },
  { key: 'trends',   label: 'Aesthetic Trends' },
  { key: 'theory',   label: 'Critical Theory' },
  { key: 'review',   label: 'Reviews' },
  { key: 'excerpt',  label: 'Excerpts' },
];

export function FilterBar({ contentTypes = [], onFilter }) {
  const el = document.createElement('div');
  el.className = 'filter-wrapper';

  // Only show types that exist in this issue (plus 'all')
  const available = ALL_TYPES.filter(t => t.key === 'all' || contentTypes.includes(t.key));

  available.forEach(({ key, label }) => {
    const btn = document.createElement('button');
    btn.className = 'filter-pill' + (key === 'all' ? ' active' : '');
    btn.textContent = label;
    btn.dataset.key = key;
    btn.addEventListener('click', () => {
      el.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      setState({ activeFilter: key });
      if (onFilter) onFilter(key);
    });
    el.appendChild(btn);
  });

  return el;
}
