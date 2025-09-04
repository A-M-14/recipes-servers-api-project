# Recipes API

A RESTful API for managing recipes with CRUD operations, filtering, search, and statistics.

## Features

- CRUD operations for recipes
- Filter by difficulty, cooking time, search terms
- Recipe statistics endpoint
- File-based JSON database
- Input validation and error handling

## Installation

```bash
npm install
npm start  # or npm run dev for development
```

Server runs on `http://localhost:3000`

## API Endpoints

**Base URL:** `http://localhost:3000/api/recipes`

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/` | Get all recipes | `difficulty`, `maxCookingTime`, `search` |
| GET | `/:id` | Get recipe by ID | - |
| POST | `/` | Create recipe | - |
| PUT | `/:id` | Update recipe | - |
| DELETE | `/:id` | Delete recipe | - |
| GET | `/stats` | Get statistics | - |

## Recipe Schema

```json
{
  "title": "string (required)",
  "description": "string (required)",
  "ingredients": ["array (required)"],
  "instructions": ["array (required)"],
  "cookingTime": "number (required)",
  "servings": "number (required)",
  "difficulty": "easy|medium|hard (required)",
  "rating": "number 1-5 (optional)"
}
```

## Example Usage

```bash
# Get all recipes
GET /api/recipes

# Filter recipes
GET /api/recipes?difficulty=easy&maxCookingTime=30

# Create recipe
POST /api/recipes
{
  "title": "Pasta",
  "description": "Simple pasta dish",
  "ingredients": ["pasta", "salt"],
  "instructions": ["Boil water", "Cook pasta"],
  "cookingTime": 15,
  "servings": 2,
  "difficulty": "easy"
}

# Get statistics
GET /api/recipes/stats
```

## Tech Stack

- Node.js, Express.js
- UUID for IDs
- Morgan (logging), CORS
- File-based JSON storage

---

*Bootcamp project for learning Node.js/Express*