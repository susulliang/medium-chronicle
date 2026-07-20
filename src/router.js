/**
 * router.js — hash-based SPA router
 * Routes: #/  |  #/archives  |  #/issue/:date
 */

const routes = {};

export const router = {
  /** Register a route handler */
  on(pattern, handler) {
    routes[pattern] = handler;
    return this;
  },

  /** Navigate to a path */
  go(path) {
    window.location.hash = path;
  },

  /** Parse current hash and dispatch */
  dispatch() {
    const hash = window.location.hash.replace(/^#\/?/, '') || '';

    if (hash === '' || hash === '/') {
      (routes['/'] || (() => {}))({});
      return;
    }
    if (hash === 'archives') {
      (routes['/archives'] || (() => {}))({});
      return;
    }
    const issueMatch = hash.match(/^issue\/(.+)$/);
    if (issueMatch) {
      (routes['/issue/:date'] || (() => {}))({ date: issueMatch[1] });
      return;
    }
    // fallback
    (routes['/'] || (() => {}))({});
  },

  /** Boot the router */
  init() {
    window.addEventListener('hashchange', () => this.dispatch());
    this.dispatch();
  },
};
