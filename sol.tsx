#writeURL(value: ContextItemValue, url: URL) {
  if (!this.#urlOptions) {
    return;
  }

  for (const searchParam of this.#urlOptions.searchParams) {
    if (value === null) {
      url.searchParams.delete(searchParam);
    } else {
      url.searchParams.delete(searchParam);

      const qs = url.searchParams.toString();

      // encode, but restore commas and turn spaces into '+'
      const encoded = encodeURIComponent(String(value))
        .replace(/%2C/gi, ',')
        .replace(/%20/gi, '+');

      const raw = `${searchParam}=${encoded}`;

      url = new URL(
        `${url.origin}${url.pathname}` + (qs ? `?${qs}&${raw}` : `?${raw}`)
      );
    }
  }

  const nextURL = url.href;
  if (nextURL !== location.href) {
    ContextItem.#historyReplaceState.call(history, {}, "", url.href);
  }
}
