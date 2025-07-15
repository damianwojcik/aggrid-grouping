function MyRenderer() {
  let eGui;

  this.init = function(params) {
    eGui = document.createElement('div');
    updateDom(params);
  };

  this.refresh = function(params) {
    // clear and rebuild inner DOM
    updateDom(params);
    return true; // returning true tells AG Grid "refresh was successful"
  };

  this.getGui = function() {
    return eGui;
  };

  function updateDom(params) {
    // Clear any existing content
    eGui.innerHTML = '';

    // Create new content
    const span = document.createElement('span');
    span.innerText = params.value + ' | ' + params.cellRendererParams.label;

    const button = document.createElement('button');
    button.innerText = 'Click';
    button.onclick = () => {
      alert('Clicked');
    };

    // Add to DOM
    eGui.appendChild(span);
    eGui.appendChild(button);
  }
}
