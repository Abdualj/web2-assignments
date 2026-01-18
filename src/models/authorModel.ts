import db from '../database/db';
import { Author, NewAuthor } from '../types/author';

export const authorModel = {
  // Get all authors
  getAllAuthors(): Author[] {
    const stmt = db.prepare('SELECT * FROM authors');
    return stmt.all() as Author[];
  },

  // Get a single author by id
  getAuthor(id: number): Author | undefined {
    const stmt = db.prepare('SELECT * FROM authors WHERE id = ?');
    return stmt.get(id) as Author | undefined;
  },

  // Get a single author by email
  getAuthorByEmail(email: string): Author | undefined {
    const stmt = db.prepare('SELECT * FROM authors WHERE email = ?');
    return stmt.get(email) as Author | undefined;
  },

  // Create a new author
  createAuthor(author: NewAuthor): Author {
    const stmt = db.prepare('INSERT INTO authors (name, email) VALUES (?, ?)');
    const result = stmt.run(author.name, author.email);
    return {
      id: result.lastInsertRowid as number,
      ...author
    };
  },

  // Update an author
  updateAuthor(id: number, author: Partial<NewAuthor>): boolean {
    const updates: string[] = [];
    const values: any[] = [];

    if (author.name !== undefined) {
      updates.push('name = ?');
      values.push(author.name);
    }
    if (author.email !== undefined) {
      updates.push('email = ?');
      values.push(author.email);
    }

    if (updates.length === 0) return false;

    values.push(id);
    const stmt = db.prepare(`UPDATE authors SET ${updates.join(', ')} WHERE id = ?`);
    const result = stmt.run(...values);
    return result.changes > 0;
  },

  // Delete an author
  deleteAuthor(id: number): boolean {
    const stmt = db.prepare('DELETE FROM authors WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
};
