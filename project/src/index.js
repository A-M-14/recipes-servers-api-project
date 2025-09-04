const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const recipesRouter = require("./routes/recipes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Logging with timestamp
app.use(morgan(":date[iso] :method :url :status :response-time ms"));
app.use(cors());
app.use(express.json());
app.use("/api/recipes", recipesRouter);
// Global error handler (must come after routes)
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Recipes API running on http://localhost:${PORT}`);
});
