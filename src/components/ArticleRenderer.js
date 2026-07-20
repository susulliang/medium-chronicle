/**
 * ArticleRenderer.js — renders one article (markdown → HTML)
 */
import { parseFrontmatter, markdownToHtml } from '../utils/markdownParser.js';

export function ArticleRenderer({ meta, markdown, date }) {
  const { frontmatter, body } = parseFrontmatter(markdown);
  const htmlBody = markdownToHtml(body);
  const pullQuote = frontmatter.pullQuote || meta.pullQuote;

  const isSidebar = meta.layout === 'sidebar';
  const colClass = !isSidebar
    ? (meta.columns === 3 ? 'article-columns-3' : 'article-columns-2')
    : '';

  const article = document.createElement('article');
  article.dataset.category = meta.type;
  article.dataset.id = meta.id;
  if (isSidebar) article.classList.add('sidebar-article');

  // Build cover image markup
  let coverHtml = '';
  if (meta.coverImage) {
    const src = `/journals/${date}/${meta.coverImage}`;
    const captionText = meta.coverCaption || '';
    coverHtml = `
      <div class="article-illustration">
        <img src="${src}" alt="${captionText}" loading="lazy">
        ${captionText ? `<div class="caption">${captionText}</div>` : ''}
      </div>`;
  }

  // Build body with optional pull quote injected after 2nd paragraph
  let bodyHtml = htmlBody;
  if (pullQuote) {
    const pullHtml = `<div class="pull-quote">${pullQuote}</div>`;
    // Insert pull quote after the 2nd closing </p>
    let count = 0;
    bodyHtml = htmlBody.replace(/<\/p>/g, (match) => {
      count++;
      return count === 2 ? `${match}${pullHtml}` : match;
    });
  }

  article.innerHTML = `
    <div class="article-header">
      <span class="article-kicker">${meta.kicker}</span>
      <${isSidebar ? 'h3' : 'h2'} class="article-title">${meta.title}</${isSidebar ? 'h3' : 'h2'}>
      <p class="article-subtitle">${meta.subtitle}</p>
    </div>
    <div class="article-meta">
      <span>By ${meta.author}</span>
      <span>${meta.location}</span>
    </div>
    ${coverHtml}
    <div class="${colClass} article-body">${bodyHtml}</div>
  `;

  return article;
}
