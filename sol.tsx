export class URLInstance {
  #url: URL;

  constructor(url?: URL | string) {
    if (url instanceof URL) {
      this.#url = new URL(url.toString());
    } else if (typeof url === 'string') {
      this.#url = new URL(url, window.location.href);
    } else {
      this.#url = new URL(window.location.href);
    }
    console.log('[URLInstance] init:', this.#url.toString());
  }

  /** Decoded value (or null if not found). */
  get(name: string): string | null {
    const raw = this.#url.searchParams.get(name);
    if (raw == null) return null;
    try {
      const decoded = decodeURIComponent(raw);
      console.log(`[URLInstance.get] ${name} -> '${decoded}'`);
      return decoded;
    } catch {
      return raw;
    }
  }

  /** Replace all occurrences with one value (or delete if null/empty). */
  set(name: string, value?: string | null): void {
    this.#url.searchParams.delete(name);
    if (value !== null && value !== undefined && value !== '') {
      this.#url.searchParams.set(name, value);
      console.log(`[URLInstance.set] '${name}'='${value}'`);
    } else {
      console.log(`[URLInstance.set] deleted '${name}'`);
    }
  }

  /** Build human-readable query string: spaces -> "_" ; no percent-encoding. */
  private toDecodedSearch(): string {
    const parts: string[] = [];
    for (const [k, v] of this.#url.searchParams.entries()) {
      const prettyVal = v.replace(/ /g, '_');
      parts.push(`${k}=${prettyVal}`);
    }
    return parts.length ? '?' + parts.join('&') : '';
  }

  /** Human-readable href (decoded query). */
  toDecodedHref(): string {
    return (
      this.#url.origin +
      this.#url.pathname +
      this.toDecodedSearch() +
      this.#url.hash
    );
  }

  /** Native encoded URL (debugging). */
  toString(): string {
    return this.#url.toString();
  }
}




//

// import where this file lives
import { URLInstance } from "../utils/URLInstance"; // <- adjust path

// ...
#writeURL(value: ContextItemValue, url: URL) {
  if (!this.#urlOptions) return;

  // Wrap the incoming URL with our helper
  const ui = new URLInstance(url);

  // Replace all occurrences of each configured searchParam
  for (const searchParam of this.#urlOptions.searchParams) {
    if (value === null) {
      ui.set(searchParam, null);         // delete
      console.log(`[ContextItem.writeURL] delete '${searchParam}'`);
    } else {
      ui.set(searchParam, String(value)); // set single value
      console.log(
        `[ContextItem.writeURL] set '${searchParam}'='${String(value)}'`
      );
    }
  }

  // Human-readable URL (spaces -> "_", no %20 etc.)
  const nextURL = ui.toDecodedHref();

  if (nextURL !== location.href) {
    // keep your existing indirection to replaceState
    ContextItem.#historyReplaceState.call(history, {}, "", nextURL);
    console.log("[ContextItem.writeURL] replaceState ->", nextURL);
  }
}
