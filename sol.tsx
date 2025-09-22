url.searchParams.set(searchParam, value);

url = new URL(
  `${url.origin}${url.pathname}?${url.searchParams.toString()}&${searchParam}=${value}`
);
