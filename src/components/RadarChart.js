/**
 * RadarChart.js — interactive SVG trend radar, data-driven from radar.json
 */
export function RadarChart({ data }) {
  const el = document.createElement('div');
  el.className = 'radar-card';

  const vertexLines = data.vertices.map(v =>
    `<line x1="100" y1="100" x2="${v.x}" y2="${v.y}" class="radar-axis"/>`
  ).join('');

  const gridPolygons = data.gridPolygons.map((pts, i) => {
    const opacity = [1, 0.7, 0.4, 0.2][i] || 0.2;
    const dash = i > 0 ? 'stroke-dasharray="2"' : '';
    return `<polygon points="${pts}" class="radar-grid" style="opacity:${opacity};${i > 0 ? ' stroke-dasharray: 2;' : ''}"/>`;
  }).join('');

  const vertices = data.vertices.map(v =>
    `<circle cx="${v.x}" cy="${v.y}" r="4" class="radar-vertex" data-key="${v.key}"/>`
  ).join('');

  const labels = data.vertices.map(v =>
    `<text x="${v.labelX}" y="${v.labelY}" class="radar-label" style="text-anchor:${v.labelAnchor};" data-key="${v.key}">${v.label}</text>`
  ).join('');

  el.innerHTML = `
    <div>
      <h3>${data.title}</h3>
      <p class="card-subtitle">${data.subtitle}</p>
    </div>
    <div class="radar-layout">
      <div class="radar-svg-container">
        <svg viewBox="0 0 200 200" width="100%" height="100%">
          ${gridPolygons}
          ${vertexLines}
          <polygon id="radar-value" points="${data.valuePolygon}" class="radar-value-area"/>
          ${vertices}
          ${labels}
        </svg>
      </div>
      <div class="trend-detail-panel" id="trend-panel">
        <h4 class="trend-detail-title" id="trend-title">Select a Coordinate</h4>
        <p class="trend-detail-text" id="trend-desc">Click on any axis label or vertex on the radar chart to inspect details of the corresponding media art trend.</p>
      </div>
    </div>
  `;

  // Build lookup map
  const trendMap = {};
  data.vertices.forEach(v => { trendMap[v.key] = v; });

  function showTrend(key) {
    const v = trendMap[key];
    if (!v) return;
    el.querySelector('#trend-title').textContent = v.title;
    el.querySelector('#trend-desc').textContent = `Strength: ${v.strength}%. ${v.description}`;
    const poly = el.querySelector('#radar-value');
    poly.style.stroke = 'var(--accent-secondary)';
    setTimeout(() => { poly.style.stroke = 'var(--accent-color)'; }, 300);
  }

  el.querySelectorAll('.radar-vertex, .radar-label').forEach(node => {
    node.addEventListener('click', () => showTrend(node.dataset.key));
  });

  return el;
}
