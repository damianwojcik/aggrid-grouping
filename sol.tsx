const connect = useCallback(
  <T,>(Component: React.ComponentType<T>): any => {
    return class ReactConnector implements community.ICellEditorComp {
      #key: string | undefined;
      #div: HTMLDivElement;
      // store the wrapped React component instance (set via ref)
      private _component: any | undefined;

      constructor() {
        this.#div = document.createElement('div');
        this.#div.className = DIV_PORTAL_CLASS_NAME;
      }

      getGui() {
        return this.#div;
      }

      init(params: T) {
        this.refresh(params);
      }

      refresh(params: T) {
        this.destroy();
        this.#key = `react-connected-${Math.random().toString(36).slice(2)}`;
        // IMPORTANT: pass a ref and capture the instance
        mount(
          this.#key,
          this.#div,
          <Component
            {...(params as any)}
            ref={(inst: any) => { this._component = inst; }}
          />
        );
        return true;
      }

      // ---- proxies to the React editor's imperative API ----
getValue() {
  return this._component?.getValue?.();
}
afterGuiAttached?(p?: any) {
  this._component?.afterGuiAttached?.(p);
}
      // ------------------------------------------------------

      destroy() {
        if (this.#key) {
          unmount(this.#key);
          this.#key = undefined;
          this._component = undefined;
        }
      }
    };
  },
  [mount, unmount]
);
