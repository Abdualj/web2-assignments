import db from '../database/db';
import { Article, ArticleWithAuthor, NewArticle } from '../types/article';

export const articleModel = {
  // Get all articles with author details
  getAllArticles(): ArticleWithAuthor[] {
    const stmt = db.prepare(`
      SELECT 
        articles.id,
        articles.title,
        articles.description,
        articles.author_id,
        authors.name as author_name,
        authors.email as author_email
      FROM articles
      INNER JOIN authors ON articles.author_id = authors.id
    `);
    return stmt.all() as ArticleWithAuthor[];
  },

  // Get a single article by id with author details
  getArticle(id: number): ArticleWithAuthor | undefined {
    const stmt = db.prepare(`
      SELECT 
        articles.id,
        articles.title,
        articles.description,
        articles.author_id,
        authors.name as author_name,
        authors.email as author_email
      FROM articles
      INNER JOIN authors ON articles.author_id = authors.id
      WHERE articles.id = ?
    `);
    return stmt.get(id) as ArticleWithAuthor | undefined;
  },

  // Get articles by author
  getArticlesByAuthor(authorId: number): ArticleWithAuthor[] {
    const stmt = db.prepare(`
      SELECT 
        articles.id,
        articles.title,
        articles.description,
        articles.author_id,
        authors.name as author_name,
        authors.email as author_email
      FROM articles
      INNER JOIN authors ON articles.author_id = authors.id
      WHERE articles.author_id = ?
    `);
    return stmt.all(authorId) as ArticleWithAuthor[];
  },

  // Create a new article
  createArticle(article: NewArticle): Article {
    const stmt = db.prepare(
      'INSERT INTO articles (title, description, author_id) VALUES (?, ?, ?)'
    );
    const result = stmt.run(article.title, article.description, article.author_id);
    return {
      id: result.lastInsertRowid as number,
      ...article
    };
  },

  // Update an article (only by the author)
  updateArticle(id: number, authorId: number, updates: Partial<Omit<NewArticle, 'author_id'>>): boolean {
    const updateFields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      updateFields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      updateFields.push('description = ?');
      values.push(updates.description);
    }

    if (updateFields.length === 0) return false;

    values.push(id, authorId);
    const stmt = db.prepare(
      `UPDATE articles SET ${updateFields.join(', ')} WHERE id = ? AND author_id = ?`
    );
    const result = stmt.run(...values);
    return result.changes > 0;
  },

  // Delete an article (only by the author)
  deleteArticle(id: number, authorId: number): boolean {
    const stmt = db.prepare('DELETE FROM articles WHERE id = ? AND author_id = ?');
    const result = stmt.run(id, authorId);
    return result.changes > 0;
  }
};
