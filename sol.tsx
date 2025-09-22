const encodeValueReadable(v: string) => encodeURIComponent(v)
    .replace(/%2C/gi, ',')  // keep commas
    .replace(/%20/gi, '+'); // show spaces as +