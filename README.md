Simple REST API for managing authors and their articles.
What it does
CRUD for Authors
CRUD for Articles
Each article belongs to one author
Only the article’s author can update or delete it
SQLite database (better-sqlite3)

Run it
npm install
npm run dev
Server runs at: http://localhost:3000

Main Endpoints
Authors
GET /api/v1/authors
GET /api/v1/authors/:id
POST /api/v1/authors
PUT /api/v1/authors/:id
DELETE /api/v1/authors/:id (fails if author has articles)

Articles
GET /api/v1/articles
GET /api/v1/articles/:id
GET /api/v1/articles/author/:authorId
POST /api/v1/articles
PUT /api/v1/articles/:id (only by author)
DELETE /api/v1/articles/:id (only by author)

Tests
npm test

Tech
Express
TypeScript
SQLite (better-sqlite3)
Jest + Supertest