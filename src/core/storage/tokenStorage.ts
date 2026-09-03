/**
 * Padanan `frontend-android/lib/core/storage/token_storage.dart`.
 *
 * Token Sanctum (bearer) disimpan di `localStorage` supaya sesi bertahan
 * melewati reload — sama seperti `flutter_secure_storage` yang membuat sesi
 * Android bertahan melewati cold start. `localStorage` bisa dibaca skrip di
 * origin ini, jadi mitigasi XSS ada di level lain: CSP ketat (lihat
 * `index.html`), tanpa `dangerouslySetInnerHTML`, dan interceptor 401 yang
 * langsung membuang token.
 *
 * Ada cache in-memory supaya pembacaan sinkron (dipakai interceptor request).
 */
const KEY = 'auth_token';

class TokenStorage {
  private cached: string | null = null;
  private loaded = false;

  /** Nilai yang terakhir diketahui, tanpa menyentuh localStorage. */
  get current(): string | null {
    if (!this.loaded) this.read();
    return this.cached;
  }

  read(): string | null {
    if (this.loaded) return this.cached;
    try {
      this.cached = window.localStorage.getItem(KEY);
    } catch {
      this.cached = null;
    }
    this.loaded = true;
    return this.cached;
  }

  save(token: string): void {
    this.cached = token;
    this.loaded = true;
    try {
      window.localStorage.setItem(KEY, token);
    } catch {
      /* mode privat / storage penuh — sesi jalan sampai tab ditutup */
    }
  }

  clear(): void {
    this.cached = null;
    this.loaded = true;
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* abaikan */
    }
  }
}

export const tokenStorage = new TokenStorage();
