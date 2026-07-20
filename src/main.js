/**
 * main.js — application bootstrap
 */
import './style.css';
import { fetchManifest, loadFullIssue } from './utils/contentLoader.js';
import { initTheme, setState, getState } from './store.js';
import { router } from './router.js';
import { Masthead } from './components/Masthead.js';
import { TopControls } from './components/TopControls.js';
import { FilterBar } from './components/FilterBar.js';
import { IssueViewer } from './components/IssueViewer.js';
import { ArchivesOverlay, openArchives, closeArchives } from './components/ArchivesOverlay.js';

// Apply saved theme immediately to prevent flash
initTheme();

const app = document.getElementById('app');
let currentViewer = null;
let manifest = null;
let header = null;
let filterBar = null;
let issueContainer = null;

async function boot() {
  try {
    manifest = await fetchManifest();
    setState({ manifest });

    // Pre-build archives overlay (singleton, hidden until needed)
    ArchivesOverlay({ manifest });

    // Setup routing
    router
      .on('/', () => renderLatestIssue())
      .on('/archives', () => {
        openArchives();
      })
      .on('/issue/:date', ({ date }) => {
        closeArchives();
        renderIssue(date, false);
      })
      .init();

  } catch (err) {
    app.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:80vh;flex-direction:column;gap:1rem;font-family:'Cinzel',serif;">
        <p style="font-size:1.5rem;opacity:0.6;">⚠ Unable to load Chronicle</p>
        <p style="font-size:0.9rem;opacity:0.4;">${err.message}</p>
      </div>`;
  }
}

async function renderLatestIssue() {
  if (!manifest?.issues?.length) return;
  const latest = manifest.issues[0]; // manifest is sorted newest → oldest
  await renderIssue(latest.date, true);
}

async function renderIssue(date, isLatest) {
  // Show loading state
  if (!issueContainer) {
    app.innerHTML = '';
    app.appendChild(buildShell());
  }

  issueContainer.innerHTML = `
    <div style="padding:4rem 0;text-align:center;font-family:var(--ui-font);font-size:0.9rem;opacity:0.5;letter-spacing:0.1em;text-transform:uppercase;">
      Loading issue…
    </div>`;

  try {
    const issue = await loadFullIssue(date);

    // Update or build header with this issue's metadata
    if (header) {
      app.removeChild(header);
      header = null;
    }
    if (filterBar) {
      app.removeChild(filterBar);
      filterBar = null;
    }

    // Rebuild header
    header = document.createElement('header');
    header.className = 'chronicle-header';

    const controls = TopControls({
      issue,
      onSearch: (q) => {
        if (currentViewer) currentViewer.filter({ activeFilter: getState().activeFilter, searchQuery: q });
      },
    });
    header.appendChild(controls);
    header.appendChild(Masthead(issue));
    app.insertBefore(header, issueContainer);

    // Rebuild filter bar
    filterBar = FilterBar({
      contentTypes: [...new Set(issue.articles.map(a => a.type))],
      onFilter: (key) => {
        if (currentViewer) currentViewer.filter({ activeFilter: key, searchQuery: getState().searchQuery });
      },
    });
    app.insertBefore(filterBar, issueContainer);

    // Render issue
    const viewer = IssueViewer({ issue, isLatest });
    currentViewer = viewer;

    issueContainer.innerHTML = '';
    issueContainer.appendChild(viewer.el);

    // Back buttons for past issues
    if (!isLatest) {
      issueContainer.querySelector('#back-to-latest')?.addEventListener('click', () => {
        router.go('/');
      });
      issueContainer.querySelector('#open-archives-from-past')?.addEventListener('click', () => {
        router.go('archives');
      });
    }

    // Update page title
    document.title = `${issue.title} | ${issue.edition}`;

  } catch (err) {
    issueContainer.innerHTML = `
      <div style="padding:4rem 0;text-align:center;font-family:var(--ui-font);opacity:0.5;">
        <p>Failed to load issue ${date}</p>
        <p style="font-size:0.8rem;margin-top:0.5rem;">${err.message}</p>
      </div>`;
  }
}

function buildShell() {
  // Build initial DOM structure
  header = document.createElement('header');
  header.className = 'chronicle-header';

  filterBar = document.createElement('div');
  filterBar.className = 'filter-wrapper';

  issueContainer = document.createElement('div');
  issueContainer.id = 'issue-container';

  const frag = document.createDocumentFragment();
  frag.appendChild(header);
  frag.appendChild(filterBar);
  frag.appendChild(issueContainer);

  return frag;
}

// Wire up hash changes for archive overlay
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash !== 'archives') {
    closeArchives();
  }
});

boot();
