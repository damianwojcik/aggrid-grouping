// useReactConnector.tsx
const connect = useCallback(
  <P,>(Component: React.ComponentType<P>) => {
    return class ReactConnector {
      #key?: string;
      #div: HTMLDivElement;
      private _component: any;

      constructor() {
        this.#div = document.createElement('div');
        this.#div.className = DIV_PORTAL_CLASS_NAME;

        // Return a proxy that forwards unknown props/methods to the wrapped instance
        return new Proxy(this, {
          get: (target, prop, receiver) => {
            if (prop in target) {
              return Reflect.get(target, prop, receiver);
            }
            const inst = target._component;
            const val = inst?.[prop as any];
            return typeof val === 'function' ? val.bind(inst) : val;
          },
        });
      }

      getGui() {
        return this.#div;
      }

      init(params: P) {
        this.refresh(params);
      }

      refresh(params: P) {
        this.destroy();
        this.#key = `react-connected-${Math.random().toString(36).slice(2)}`;
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

      destroy() {
        if (this.#key) {
          unmount(this.#key);
          this._component = undefined;
          this.#key = undefined;
        }
      }
    } as any; // keep it generic/agnostic
  },
  [mount, unmount]
);


 useImperativeHandle(ref, () => ({
      // ag-Grid will fetch this when editing ends
      getValue: () => value,
      // optional but handy: focus the input when attached
      afterGuiAttached: () => {
        inputRef.current?.focus();
        inputRef.current?.select();
      },
      // optional: let grid move focus into the editor
      focusIn: () => inputRef.current?.focus(),
    }));