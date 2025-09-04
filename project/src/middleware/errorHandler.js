function errorHandler(err, req, res, next) {
  // If err has statusCode, use it. Otherwise 500.
  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";
  // Log server errors
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({ error: true, message, statusCode: status });
}
module.exports = { errorHandler };
