const storageRef = useRef<{
  content: any[];
  notifyList: Set<() => void>;
}>({
  content: storage.launchpads,
  notifyList: new Set(),
});

useEffect(() => {
  storageRef.current.content = storage.launchpads;
  storageRef.current.notifyList.forEach(fn => fn()); // 🔔 notify all renderers
}, [storage.launchpads]);


init(params: ICellRendererParams & { context: any }): void {
  this.eGui = document.createElement('div');

  const ref = params.context?.storageRef;
  const update = () => {
    const data = ref.current?.content ?? [];
    if (data.length !== this.lastDataLength) {
      this.lastDataLength = data.length;
      this.renderButtons(data);
    }
  };

  // Register this renderer's callback
  ref?.notifyList?.add(update);
  this.cleanup = () => ref?.notifyList?.delete(update);

  // Initial render
  update();
}


destroy(): void {
  this.cleanup?.(); // ✅ clean up to prevent memory leaks
}
