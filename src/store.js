/**
 * store.js — lightweight reactive state
 */

const state = {
  manifest: null,
  currentIssue: null,
  theme: localStorage.getItem('chronicle-theme') || 'paper',
  activeFilter: 'all',
  searchQuery: '',
};

const listeners = {};

export function getState() { return { ...state }; }

export function setState(patch) {
  Object.assign(state, patch);
  Object.keys(patch).forEach(key => {
    (listeners[key] || []).forEach(fn => fn(state[key]));
  });
}

export function subscribe(key, fn) {
  if (!listeners[key]) listeners[key] = [];
  listeners[key].push(fn);
  return () => { listeners[key] = listeners[key].filter(f => f !== fn); };
}

/** Apply + persist the theme */
export function setTheme(theme) {
  setState({ theme });
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('chronicle-theme', theme);
}

/** Initialize theme from saved state */
export function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
}
