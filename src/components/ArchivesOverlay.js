/**
 * ArchivesOverlay.js — full-screen archives browser, slides in from right
 */
import { IssueCard } from './IssueCard.js';
import { router } from '../router.js';

let overlayEl = null;

export function ArchivesOverlay({ manifest }) {
  if (overlayEl) return overlayEl;

  const el = document.createElement('div');
  el.className = 'archives-overlay';
  el.id = 'archives-overlay';
  overlayEl = el;

  const issues = manifest?.issues || [];

  const grid = issues.map(issue => {
    const card = IssueCard({ issue });
    return card;
  });

  el.innerHTML = `
    <div class="archives-header">
      <h2>Archive</h2>
      <button class="archives-close" id="archives-close-btn" aria-label="Close archives">✕</button>
    </div>
    <div class="archives-body">
      <div class="archives-count">${issues.length} issue${issues.length !== 1 ? 's' : ''} published</div>
      <div class="archives-grid" id="archives-grid"></div>
    </div>
  `;

  const gridEl = el.querySelector('#archives-grid');
  grid.forEach(card => gridEl.appendChild(card));

  // Close button
  el.querySelector('#archives-close-btn').addEventListener('click', () => {
    closeArchives();
    router.go('/');
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && el.classList.contains('open')) {
      closeArchives();
      router.go('/');
    }
  });

  document.body.appendChild(el);
  return el;
}

export function openArchives() {
  if (overlayEl) {
    overlayEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

export function closeArchives() {
  if (overlayEl) {
    overlayEl.classList.remove('open');
    document.body.style.overflow = '';
  }
}
