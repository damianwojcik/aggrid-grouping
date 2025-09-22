#writeURL(value: ContextItemValue, url: URL) {
  if (!this.#urlOptions) {
    return;
  }

  // Collect all params into an array of key=value strings
  const parts: string[] = [];

  for (const searchParam of this.#urlOptions.searchParams) {
    if (value === null) {
      // skip (delete case)
      continue;
    }

    if (searchParam === this.#urlChosenSearchParam) {
      // insert our new value with raw commas
      parts.push(`${searchParam}=${value}`);
    } else if (url.searchParams.has(searchParam)) {
      // preserve other params, decoded so we don’t carry %2C
      parts.push(`${searchParam}=${decodeURIComponent(url.searchParams.get(searchParam)!)}`);
    }
  }

  // Rebuild query manually
  const newHref =
    `${url.origin}${url.pathname}` + (parts.length ? `?${parts.join("&")}` : "");

  if (newHref !== location.href) {
    ContextItem.#historyReplaceState.call(history, {}, "", newHref);
  }
}
