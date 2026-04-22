// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, _next) {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV !== "test") {
    console.error(`[error] ${req.method} ${req.originalUrl} -> ${status}: ${message}`);
  }

  res.status(status).json({
    success: false,
    message,
  });
};
