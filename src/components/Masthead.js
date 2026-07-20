/**
 * Masthead.js — Chronicle nameplate and submasthead
 */
export function Masthead({ title, subtitle, scope, scopeShort, edition, date }) {
  const el = document.createElement('div');

  el.innerHTML = `
    <div class="masthead">
      <h1 class="masthead-title">${title}</h1>
      ${subtitle ? `<p class="masthead-tagline">${subtitle}</p>` : ''}
    </div>
    <div class="submasthead">
      <span>${scope || scopeShort}</span>
      <span>Aesthetic &amp; Cultural Inquiry</span>
      <span>Printed on Recycled Electrons</span>
    </div>
  `;
  return el;
}
