#!/usr/bin/env node
/**
 * generate-manifest.js
 * Scans journals/ directory, reads each issue.json, and writes journals/manifest.json
 * Run: node scripts/generate-manifest.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const journalsDir = path.join(__dirname, '..', 'journals');
const manifestPath = path.join(journalsDir, 'manifest.json');

function generateManifest() {
  const entries = fs.readdirSync(journalsDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(d.name))
    .map(d => {
      const issueFile = path.join(journalsDir, d.name, 'issue.json');
      if (!fs.existsSync(issueFile)) {
        console.warn(`⚠️  No issue.json found in journals/${d.name}, skipping.`);
        return null;
      }
      const issue = JSON.parse(fs.readFileSync(issueFile, 'utf8'));
      const coverThumb = issue.articles.find(a => a.coverImage)?.coverImage
        ? `journals/${d.name}/${issue.articles.find(a => a.coverImage).coverImage}`
        : null;

      return {
        date:         issue.date,
        edition:      issue.edition,
        title:        issue.subtitle || issue.title,
        subtitle:     issue.subtitle,
        description:  issue.description || '',
        scopeShort:   issue.scopeShort || '',
        contentTypes: [...new Set(issue.articles.map(a => a.type))],
        coverThumb,
        articleCount: issue.articles.length,
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const manifest = {
    generated: new Date().toISOString(),
    issues: entries,
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`✅  manifest.json updated — ${entries.length} issue(s) indexed.`);
  entries.forEach(e => console.log(`   • ${e.date}  ${e.title}`));
}

generateManifest();
