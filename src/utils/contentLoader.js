/**
 * contentLoader.js — fetch helpers for journal content
 */

const cache = new Map();

async function fetchJSON(url) {
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const data = await res.json();
  cache.set(url, data);
  return data;
}

async function fetchText(url) {
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const text = await res.text();
  cache.set(url, text);
  return text;
}

/** Fetch the master manifest */
export async function fetchManifest() {
  return fetchJSON('/journals/manifest.json');
}

/** Fetch a specific issue's metadata */
export async function fetchIssue(date) {
  return fetchJSON(`/journals/${date}/issue.json`);
}

/** Fetch an article's Markdown source */
export async function fetchArticleMarkdown(date, filePath) {
  return fetchText(`/journals/${date}/${filePath}`);
}

/** Fetch radar infographic data */
export async function fetchRadar(date, radarPath) {
  return fetchJSON(`/journals/${date}/${radarPath}`);
}

/** Fetch calendar infographic data */
export async function fetchCalendar(date, calendarPath) {
  return fetchJSON(`/journals/${date}/${calendarPath}`);
}

/** Load a full issue including article content */
export async function loadFullIssue(date) {
  const issue = await fetchIssue(date);

  // Load all article markdown in parallel
  const articleContents = await Promise.all(
    issue.articles.map(a => fetchArticleMarkdown(date, a.file))
  );

  const articles = issue.articles.map((meta, i) => ({
    ...meta,
    markdown: articleContents[i],
  }));

  // Load infographics in parallel
  const [radar, calendar] = await Promise.all([
    fetchRadar(date, issue.infographics.radar),
    fetchCalendar(date, issue.infographics.calendar),
  ]);

  return { ...issue, articles, radar, calendar };
}
