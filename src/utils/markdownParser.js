/**
 * markdownParser.js — thin wrapper around marked for article rendering
 */
import { marked } from 'marked';

// Configure marked for clean output
marked.setOptions({
  gfm: true,
  breaks: false,
});

/**
 * Parse YAML frontmatter and markdown body from a .md file string.
 * Returns { frontmatter: {}, body: '' }
 */
export function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: raw.trim() };

  const frontmatter = {};
  match[1].split('\n').forEach(line => {
    const colon = line.indexOf(':');
    if (colon === -1) return;
    const key = line.slice(0, colon).trim();
    let val = line.slice(colon + 1).trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    // Handle null
    if (val === 'null') val = null;
    frontmatter[key] = val;
  });

  return { frontmatter, body: match[2].trim() };
}

/**
 * Convert markdown body to HTML string.
 * The first paragraph gets class="lead" for the drop-cap effect.
 */
export function markdownToHtml(mdBody) {
  const html = marked.parse(mdBody);
  // Add .lead to the first <p>
  return html.replace('<p>', '<p class="lead">');
}
