function validateRecipe(req, res, next) {
  const payload = req.body;
  const errors = [];
  function add(msg) {
    errors.push(msg);
  }

  if (!payload || typeof payload !== "object")
    add("Request body must be a JSON object");
  // title
  if (!payload.title || typeof payload.title !== "string")
    add("title is required and must be a string");
  else if (payload.title.length < 3 || payload.title.length > 100)
    add("title must be between 3 and 100 characters");

  // description
  if (!payload.description || typeof payload.description !== "string")
    add("description is required and must be a string");
  else if (payload.description.length < 10 || payload.description.length > 500)
    add("description must be between 10 and 500 characters");
  // ingredients
  if (!Array.isArray(payload.ingredients))
    add("ingredients is required and must be an array");
  else if (payload.ingredients.length < 1)
    add("ingredients must contain at least 1 item");
  else if (
    !payload.ingredients.every(
      (i) => typeof i === "string" && i.trim().length > 0
    )
  )
    add("every ingredient must be a non-empty string");
  // instructions
  if (!Array.isArray(payload.instructions))
    add("instructions is required and must be an array");
  else if (payload.instructions.length < 1)
    add("instructions must contain at least 1 step");
  else if (
    !payload.instructions.every(
      (i) => typeof i === "string" && i.trim().length > 0
    )
  )
    add("every instruction must be a non-empty string");
  // cookingTime
  if (
    payload.cookingTime === undefined ||
    typeof payload.cookingTime !== "number" ||
    Number.isNaN(payload.cookingTime)
  )
    add("cookingTime is required and must be a number");
  else if (payload.cookingTime <= 0)
    add("cookingTime must be a positive number");
  // servings
  if (payload.servings === undefined || !Number.isInteger(payload.servings))
    add("servings is required and must be an integer");
  else if (payload.servings <= 0) add("servings must be a positive integer");

  // difficulty
  const allowed = ["easy", "medium", "hard"];
  if (!payload.difficulty || typeof payload.difficulty !== "string")
    add("difficulty is required and must be a string");
  else if (!allowed.includes(payload.difficulty))
    add("difficulty must be one of: easy, medium, hard");

  // rating (optional) - if provided validate
  if (payload.rating !== undefined) {
    if (
      typeof payload.rating !== "number" ||
      payload.rating < 0 ||
      payload.rating > 5
    )
      add("rating must be a number between 0 and 5");
  }
  if (errors.length) {
    return res
      .status(400)
      .json({ error: true, message: errors.join("; "), statusCode: 400 });
  }
  next();
}
module.exports = { validateRecipe };
