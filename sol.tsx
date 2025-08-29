const connect = useCallback(
  <P,>(Component: React.ComponentType<P>) => {
    return class ReactConnector {
      private key?: string;
      private div: HTMLDivElement;
      private _component: any;

      constructor() {
        this.div = document.createElement("div");
        this.div.className = DIV_PORTAL_CLASS_NAME;

        return new Proxy(this, {
          get: (target, prop, receiver) => {
            if (prop in target) {
              return Reflect.get(target, prop, receiver);
            }
            const inst = target._component;
            const val = inst?.[prop as any];
            return typeof val === "function" ? val.bind(inst) : val;
          },
        });
      }

      getGui() {
        return this.div;
      }

      init(params: P) {
        this.refresh(params);
      }

      refresh(params: P) {
        this.destroy();
        this.key = `react-connected-${Math.random().toString(36).slice(2)}`;
        mount(
          this.key,
          this.div,
          <Component {...(params as any)} ref={(inst: any) => (this._component = inst)} />
        );
        return true;
      }

      destroy() {
        if (this.key) {
          unmount(this.key);
          this._component = undefined;
          this.key = undefined;
        }
      }
    } as any;
  },
  [mount, unmount]
);
