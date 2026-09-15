const KEY = 'auth_token';

class TokenStorage {
  private cached: string | null = null;
  private loaded = false;

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
    } catch {}
  }

  clear(): void {
    this.cached = null;
    this.loaded = true;
    try {
      window.localStorage.removeItem(KEY);
    } catch {}
  }
}

export const tokenStorage = new TokenStorage();
