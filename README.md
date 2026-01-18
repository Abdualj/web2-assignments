# Express.js + TypeScript + SQLite API

A REST API for managing articles and authors using Express.js, TypeScript, and SQLite.

## Features

- **Authors Management**: Create, read, update, and delete authors
- **Articles Management**: Create, read, update, and delete articles
- **Author-Article Relationship**: Articles are linked to authors with foreign key constraints
- **Author Authorization**: Only the author of an article can update or delete it
- **SQLite Database**: Lightweight, serverless database using better-sqlite3

## Database Schema

### Authors Table
- `id`: INTEGER (Primary Key, Auto-increment)
- `name`: TEXT (Required)
- `email`: TEXT (Required, Unique)

### Articles Table
- `id`: INTEGER (Primary Key, Auto-increment)
- `title`: TEXT (Required)
- `description`: TEXT (Required)
- `author_id`: INTEGER (Foreign Key to authors.id, Required)

## Installation

```bash
npm install
```

## Running the Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run build
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Example Endpoint
- `GET /api/v1/example` - Test endpoint

### Authors
- `GET /api/v1/authors` - Get all authors
- `GET /api/v1/authors/:id` - Get a single author
- `POST /api/v1/authors` - Create a new author
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```
- `PUT /api/v1/authors/:id` - Update an author
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
  ```
- `DELETE /api/v1/authors/:id` - Delete an author (only if no articles exist)

### Articles
- `GET /api/v1/articles` - Get all articles with author information
- `GET /api/v1/articles/:id` - Get a single article with author information
- `GET /api/v1/articles/author/:authorId` - Get all articles by a specific author
- `POST /api/v1/articles` - Create a new article
  ```json
  {
    "title": "Article Title",
    "description": "Article description",
    "author_id": 1
  }
  ```
- `PUT /api/v1/articles/:id` - Update an article (only by the author)
  ```json
  {
    "title": "Updated Title",
    "description": "Updated description",
    "author_id": 1
  }
  ```
- `DELETE /api/v1/articles/:id` - Delete an article (only by the author)
  ```json
  {
    "author_id": 1
  }
  ```

## Testing

Run the integration tests:

```bash
npm test
```

## Test Results

All tests passed successfully! ✅

```
PASS src/tests/integration.test.ts
  Integration Tests
    Authors API
      ✓ GET /api/v1/authors - should return all authors (13 ms)
      ✓ POST /api/v1/authors - should create a new author (9 ms)
      ✓ GET /api/v1/authors/:id - should return a single author (2 ms)
      ✓ PUT /api/v1/authors/:id - should update an author (3 ms)
      ✓ POST /api/v1/authors - should fail with duplicate email (2 ms)
    Articles API
      ✓ GET /api/v1/articles - should return all articles with author info (2 ms)
      ✓ POST /api/v1/articles - should create a new article (2 ms)
      ✓ GET /api/v1/articles/:id - should return a single article with author (4 ms)
      ✓ PUT /api/v1/articles/:id - should update article by author (4 ms)
      ✓ PUT /api/v1/articles/:id - should fail when wrong author tries to update (2 ms)
      ✓ GET /api/v1/articles/author/:authorId - should return articles by author (1 ms)
      ✓ DELETE /api/v1/articles/:id - should delete article by author (3 ms)
      ✓ POST /api/v1/articles - should fail without author_id (1 ms)
    Foreign Key Constraints
      ✓ DELETE /api/v1/authors/:id - should fail if author has articles (2 ms)
      ✓ DELETE /api/v1/authors/:id - should succeed if no articles (1 ms)

Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
```

## Project Structure

```
src/
├── controllers/      # Request handlers
├── database/         # Database initialization
├── models/          # Data access layer
├── routes/          # API route definitions
├── tests/           # Integration tests
└── types/           # TypeScript type definitions
```

## Key Features Implementation

### Foreign Key Constraint
The articles table has a foreign key constraint to the authors table. This means:
- You cannot create an article with a non-existent author_id
- You cannot delete an author if they have articles
- Articles maintain referential integrity with authors

### Author Authorization
- Only the author of an article can update or delete it
- Update/Delete operations require the `author_id` to be provided
- SQL queries use: `WHERE id = ? AND author_id = ?`

### JOIN Queries
When fetching articles, the API automatically includes author information using SQL JOIN:
```sql
SELECT 
  articles.id,
  articles.title,
  articles.description,
  articles.author_id,
  authors.name as author_name,
  authors.email as author_email
FROM articles
INNER JOIN authors ON articles.author_id = authors.id
```

## Technologies Used

- **Express.js 5.x** - Web framework
- **TypeScript** - Type safety
- **better-sqlite3** - SQLite database driver
- **Jest** - Testing framework
- **Supertest** - HTTP testing library
