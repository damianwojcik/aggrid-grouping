const targetIndex = arr.findIndex(v => v.path.length === 1 && v.path[0] === 'abc');
arr.splice(targetIndex + 1, 0, newView);