export const CellRenderer: ICellRendererFunc = (params) => {
  const span = document.createElement('span');
  span.textContent = 'Loading...';

  if (params.data) {
    userStorage.read().then(content => {
      span.textContent = content;
    });
  }

  span.addEventListener('click', async () => {
    // np. zrób coś po kliknięciu
  });

  return span;
};
