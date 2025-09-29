set(name: string, value?: string | null): void {
  if (value === undefined) {
    return;
  }

  if (value === null || value === "") {
    this.#url.searchParams.delete(name);
    return;
  }

  const encoded = value.replace(/ /g, spaceCharReplacement);
  this.#url.searchParams.set(name, encoded);
}
