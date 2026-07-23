export const requestLogger = (serviceName) => (req, res, next) => {
  console.log(`[${serviceName}] ${req.method} ${req.url}`);
  next();
};

export const notFoundHandler = (serviceName) => (req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.url });
};
