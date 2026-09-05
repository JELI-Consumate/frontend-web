import '@testing-library/jest-dom/vitest';

// jsdom tidak mengimplementasikan Element.prototype.scrollTo -- dipakai
// `ModulePageScaffold` (reset scroll body per halaman). Tanpa polyfill ini,
// render layar modul 1-halaman melempar di test.
if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = () => {};
}
