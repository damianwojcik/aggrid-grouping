function MyRenderer() {
  let eGui;
  this._lastParams = {};

  this.init = function(params) {
    eGui = document.createElement('div');
    updateDom(params);
  };

  this.refresh = function(params) {
    // 👇 Deep diff key fields across refresh calls
    const changes = [];

    const currentParams = {
      value: params.value,
      label: params.cellRendererParams?.label,
      rowId: params.node.id,
      dataId: params.data?.id,
      classList: eGui.className,
    };

    for (const key in currentParams) {
      const oldVal = this._lastParams[key];
      const newVal = currentParams[key];
      if (oldVal !== newVal) {
        changes.push({ key, oldVal, newVal });
      }
    }

    if (changes.length > 0) {
      console.log('🔁 Refresh changes detected:', changes);
    } else {
      console.log('🔁 Refresh called — no changes');
    }

    this._lastParams = currentParams;

    // ✅ optional actual refresh logic if needed
    updateDom(params);
    return true;
  };

  this.getGui = function() {
    return eGui;
  };

  function updateDom(params) {
    eGui.innerHTML = '';
    const span = document.createElement('span');
    span.innerText = `Label: ${params.cellRendererParams.label}, Value: ${params.value}`;
    eGui.appendChild(span);
  }
}
