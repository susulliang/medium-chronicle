/**
 * Masthead.js — Chronicle nameplate, tagline, and submasthead
 */
export function Masthead({ title, subtitle, scope, scopeShort, edition, date }) {
  const el = document.createElement('div');

  const dateObj = new Date(date + 'T12:00:00');
  const dateStr = dateObj.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  el.innerHTML = `
    <div class="masthead">
      <h1 class="masthead-title">${title}</h1>
      <p class="masthead-tagline">"Printed on Recycled Electrons" — A Global Broadside of Digital Art, Media Studies, and Experimental Curation</p>
    </div>
    <div class="submasthead">
      <span>${scope || scopeShort}</span>
      <span>Global Edition</span>
      <span>Aesthetic &amp; Cultural Inquiry</span>
    </div>
  `;
  return el;
}
