/**
 * IssueCard.js — single issue card for the archives grid
 */
import { router } from '../router.js';

export function IssueCard({ issue }) {
  const el = document.createElement('div');
  el.className = 'issue-card';
  el.role = 'button';
  el.tabIndex = 0;

  const dateObj = new Date(issue.date + 'T12:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const thumbHtml = issue.coverThumb
    ? `<img class="issue-card-thumb" src="/${issue.coverThumb}" alt="${issue.title}" loading="lazy">`
    : `<div class="issue-card-thumb-placeholder">◈</div>`;

  const tags = (issue.contentTypes || [])
    .map(t => `<span class="issue-tag">${t}</span>`).join('');

  el.innerHTML = `
    ${thumbHtml}
    <div class="issue-card-body">
      <div class="issue-card-date">${formattedDate}</div>
      <div class="issue-card-title">${issue.title}</div>
      <div class="issue-card-subtitle">${issue.subtitle || ''}</div>
      <div class="issue-card-tags">${tags}</div>
      <div class="issue-card-edition">${issue.edition} · ${issue.articleCount} articles</div>
    </div>
  `;

  const navigate = () => router.go(`issue/${issue.date}`);
  el.addEventListener('click', navigate);
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') navigate(); });

  return el;
}
