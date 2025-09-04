const observer = new ResizeObserver(() => {
  if (element) {
    const { height, width, top, left } = element.getBoundingClientRect();
    requestAnimationFrame(() => {
      setDimensions({ height, width, top, left });
    });
  }
});
