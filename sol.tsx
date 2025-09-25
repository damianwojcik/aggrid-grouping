export const getRequest = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }

  return (await response.json()) as T;
};


const data = await getRequest<GetRequestResponse>(Endpoint.List);
