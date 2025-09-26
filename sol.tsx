// Config: character used in place of space (" " -> "_")
const spaceCharReplacement = "_";

export class URLInstance {
  #url: URL;

  constructor(url?: URL | string) {
    if (url instanceof URL) {
      this.#url = new URL(url.toString());
    } else if (typeof url === "string") {
      this.#url = new URL(url, window.location.href);
    } else {
      this.#url = new URL(window.location.href);
    }
    console.log("[URLInstance] init:", this.#url.toString());
  }

  /** Decoded value (replace replacement back into spaces). */
  get(name: string): string | null {
    const raw = this.#url.searchParams.get(name);
    if (raw == null) return null;

    try {
      return decodeURIComponent(raw).replace(
        new RegExp(spaceCharReplacement, "g"),
        " "
      );
    } catch {
      return raw.replace(new RegExp(spaceCharReplacement, "g"), " ");
    }
  }

  /** Replace all occurrences with one value (or delete if null/empty). */
  set(name: string, value?: string | null): void {
    this.#url.searchParams.delete(name);
    if (value !== null && value !== undefined && value !== "") {
      // When writing, convert spaces into our replacement
      const encoded = value.replace(/ /g, spaceCharReplacement);
      this.#url.searchParams.set(name, encoded);
      console.log(`[URLInstance.set] '${name}'='${encoded}'`);
    } else {
      console.log(`[URLInstance.set] deleted '${name}'`);
    }
  }

  /** Build human-readable query string (already has replacement). */
  private toDecodedSearch(): string {
    const parts: string[] = [];
    this.#url.searchParams.forEach((v, k) => {
      parts.push(`${k}=${v}`);
    });
    return parts.length ? "?" + parts.join("&") : "";
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
