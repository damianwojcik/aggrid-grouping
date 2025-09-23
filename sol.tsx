const withErrorHandling = (fn) => async () => {
  try {
    return await fn();
  } catch (err) {
    console.error(`Error in ${fn.name}:`, err);
    throw err; // rethrow if you want the caller to know
  }
};

const connect = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("Connection failed")), 500);
  });
};

const safeConnect = withErrorHandling(connect);

