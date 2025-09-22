#writeURL(value: ContextItemValue, url: URL) {
  if (!this.#urlOptions) {
    return;
  }

  for (const searchParam of this.#urlOptions.searchParams) {
    if (value === null) {
      url.searchParams.delete(searchParam);
    } else {
      // instead of url.searchParams.set(...) which encodes commas
      url.searchParams.delete(searchParam); // remove old
      const qs = url.searchParams.toString();
      const raw = `${searchParam}=${value}`;
      url = new URL(
        `${url.origin}${url.pathname}` + (qs ? `?${qs}&${raw}` : `?${raw}`)
      );
    }
  }

  const nextURL = url.href;
  console.log("!!! nextUrl", nextURL, url);
  if (nextURL !== location.href) {
    ContextItem.#historyReplaceState.call(history, {}, "", url.href);
  }
}
