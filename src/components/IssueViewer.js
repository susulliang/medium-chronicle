/**
 * IssueViewer.js — renders a full journal issue
 */
import { ArticleRenderer } from './ArticleRenderer.js';
import { RadarChart } from './RadarChart.js';
import { CalendarTable, filterCalendar } from './CalendarTable.js';

export function IssueViewer({ issue, isLatest = true }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'issue-viewer';

  // Back banner for past issues
  if (!isLatest) {
    const banner = document.createElement('div');
    banner.className = 'back-banner';
    banner.innerHTML = `
      <button id="back-to-latest">← Current Issue</button>
      <span>|</span>
      <button id="open-archives-from-past">See All Archives</button>
    `;
    wrapper.appendChild(banner);
  }

  // Separate main and sidebar articles
  const mainArticles = issue.articles.filter(a => a.layout === 'main');
  const sidebarArticles = issue.articles.filter(a => a.layout === 'sidebar');

  // Newspaper grid
  const grid = document.createElement('main');
  grid.className = 'newspaper-grid';

  // Main column
  const mainSection = document.createElement('section');
  mainSection.className = 'main-section';

  mainArticles.forEach((meta, i) => {
    if (i > 0) {
      const divider = document.createElement('div');
      divider.className = 'single-border-top';
      mainSection.appendChild(divider);
    }
    const articleEl = ArticleRenderer({ meta, markdown: meta.markdown, date: issue.date });
    mainSection.appendChild(articleEl);
  });

  // Sidebar column
  const sidebarSection = document.createElement('section');
  sidebarSection.className = 'sidebar-section';

  sidebarArticles.forEach((meta, i) => {
    if (i > 0) {
      const dinkus = document.createElement('div');
      dinkus.className = 'dinkus';
      dinkus.textContent = '* * *';
      sidebarSection.appendChild(dinkus);
    }
    const articleEl = ArticleRenderer({ meta, markdown: meta.markdown, date: issue.date });
    sidebarSection.appendChild(articleEl);
  });

  grid.appendChild(mainSection);
  grid.appendChild(sidebarSection);
  wrapper.appendChild(grid);

  // Infographics row
  const infographicsRow = document.createElement('section');
  infographicsRow.className = 'infographics-row';

  const radarEl = RadarChart({ data: issue.radar });
  const calendarEl = CalendarTable({ data: issue.calendar });

  infographicsRow.appendChild(radarEl);
  infographicsRow.appendChild(calendarEl);
  wrapper.appendChild(infographicsRow);

  // Footer
  const footer = document.createElement('footer');
  footer.innerHTML = `
    <p>© ${new Date(issue.date).getFullYear()} The Metamedium Chronicle. All rights reserved.</p>
    <p class="footer-colophon">Compiled and designed in the spirit of classic print layouts and modern cybernetic interfaces. Open to the public.</p>
  `;
  wrapper.appendChild(footer);

  return {
    el: wrapper,
    /** Filter articles and calendar rows */
    filter({ activeFilter, searchQuery }) {
      const articles = wrapper.querySelectorAll('article');
      articles.forEach(article => {
        const titleEl = article.querySelector('.article-title');
        const subtitleEl = article.querySelector('.article-subtitle');
        const kickerEl = article.querySelector('.article-kicker');
        const category = article.dataset.category;

        const title = titleEl?.textContent.toLowerCase() || '';
        const subtitle = subtitleEl?.textContent.toLowerCase() || '';
        const kicker = kickerEl?.textContent.toLowerCase() || '';

        const matchesQuery = !searchQuery ||
          title.includes(searchQuery) ||
          subtitle.includes(searchQuery) ||
          kicker.includes(searchQuery);
        const matchesCategory = activeFilter === 'all' || category === activeFilter;

        article.classList.toggle('hidden', !(matchesQuery && matchesCategory));
      });

      filterCalendar(calendarEl, { activeFilter, searchQuery });
    },
  };
}
