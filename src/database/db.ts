import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../../database.sqlite'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create authors table
const createAuthorsTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )
`);

createAuthorsTable.run();

// Create articles table with author_id foreign key
const createArticlesTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    FOREIGN KEY (author_id) REFERENCES authors(id)
  )
`);

createArticlesTable.run();

// Insert initial authors
const insertAuthor = db.prepare(`
  INSERT OR IGNORE INTO authors (name, email) VALUES (?, ?)
`);

const authors = [
  { name: 'John Doe', email: 'john.doe@example.com' },
  { name: 'Jane Smith', email: 'jane.smith@example.com' },
  { name: 'Bob Johnson', email: 'bob.johnson@example.com' }
];

authors.forEach(author => {
  try {
    insertAuthor.run(author.name, author.email);
  } catch (error) {
    // Author already exists
  }
});

// Insert initial articles
const insertArticle = db.prepare(`
  INSERT OR IGNORE INTO articles (id, title, description, author_id) VALUES (?, ?, ?, ?)
`);

const articles = [
  { id: 1, title: 'First Article', description: 'This is the first article', author_id: 1 },
  { id: 2, title: 'Second Article', description: 'This is the second article', author_id: 2 },
  { id: 3, title: 'Third Article', description: 'This is the third article', author_id: 1 }
];

articles.forEach(article => {
  try {
    insertArticle.run(article.id, article.title, article.description, article.author_id);
  } catch (error) {
    // Article already exists
  }
});

console.log('Database initialized successfully');

export default db;
