    refresh(params: any) {
      this.destroy?.();
      this.#key = `react-connected-${Math.random().toString(36).slice(2)}`;
      mount(this.#key, this.#div, <Component {...params} />);

      // 🔑 unwrap container in max 3 lines
      requestAnimationFrame(() => {
        if (this.#div.childElementCount === 1) this.#div.replaceWith(this.#div.firstElementChild!);
      });

      return true;
    }
