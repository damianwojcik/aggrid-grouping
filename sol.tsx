const connect = useCallback(
  <T,>(Component: React.ComponentType<T>): any => {
    return class ReactConnector implements agGrid.ICellEditorComp {
      #key: string | undefined;
      #div: HTMLDivElement;

      constructor() {
        this.#div = document.createElement('div');
        this.#div.className = DIV_PORTAL_CLASS_NAME;
      }

      init(params: T) {
        this.refresh(params);
      }

      refresh(params: T) {
        this.destroy();
        this.#key = `react-connected-${Math.random().toString(36).slice(2)}`;
        mount(
          this.#key,
          this.#div,
          <Component {...(params as any)} ref={(inst: any) => (this._component = inst)} />
        );
        return true;
      }

      getGui() {
        return this.#div;
      }

      /** forward getValue to wrapped component */
      getValue() {
        return this._component?.getValue?.();
      }

      destroy() {
        if (this.#key) {
          unmount(this.#key);
          this.#key = undefined;
        }
      }
    };
  },
  [mount, unmount]
);
