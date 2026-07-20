/**
 * CalendarTable.js — festival index table, filterable by type/search
 */
export function CalendarTable({ data }) {
  const el = document.createElement('div');
  el.className = 'calendar-card';

  const badgeClass = { festival: 'badge-festival', symposium: 'badge-symposium', ongoing: 'badge-ongoing' };

  const rows = data.rows.map(row => `
    <tr data-type="${row.type}">
      <td><strong>${row.name}</strong></td>
      <td>${row.date}</td>
      <td>${row.region}</td>
      <td><span class="badge ${badgeClass[row.badge] || ''}">${row.theme}</span></td>
    </tr>
  `).join('');

  el.innerHTML = `
    <div class="calendar-title-row">
      <div>
        <h3>${data.title}</h3>
        <p class="card-subtitle">${data.subtitle}</p>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          ${data.columns.map(c => `<th>${c}</th>`).join('')}
        </tr>
      </thead>
      <tbody id="calendar-body">${rows}</tbody>
    </table>
  `;

  return el;
}

/** Filter calendar rows by active category and search query */
export function filterCalendar(calendarEl, { activeFilter, searchQuery }) {
  if (!calendarEl) return;
  calendarEl.querySelectorAll('#calendar-body tr').forEach(row => {
    const text = row.textContent.toLowerCase();
    const type = row.dataset.type;
    const matchesQuery = !searchQuery || text.includes(searchQuery);
    const matchesCategory = activeFilter === 'all' || type === activeFilter;
    row.classList.toggle('filtered-out', !(matchesQuery && matchesCategory));
  });
}
