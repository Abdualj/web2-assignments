import { Request, Response } from 'express';
import { articleModel } from '../models/articleModel';
import { authorModel } from '../models/authorModel';
import { NewArticle } from '../types/article';

export const articleController = {
  // GET /api/v1/articles
  getAllArticles: (req: Request, res: Response) => {
    try {
      const articles = articleModel.getAllArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch articles' });
    }
  },

  // GET /api/v1/articles/:id
  getArticle: (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const article = articleModel.getArticle(id);
      
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch article' });
    }
  },

  // GET /api/v1/articles/author/:authorId
  getArticlesByAuthor: (req: Request, res: Response) => {
    try {
      const authorId = parseInt(req.params.authorId as string);
      const articles = articleModel.getArticlesByAuthor(authorId);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch articles' });
    }
  },

  // POST /api/v1/articles
  createArticle: (req: Request, res: Response) => {
    try {
      const { title, description, author_id } = req.body;
      
      if (!title || !description || !author_id) {
        return res.status(400).json({ 
          error: 'Title, description, and author_id are required' 
        });
      }

      // Verify author exists
      const author = authorModel.getAuthor(author_id);
      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }

      const newArticle: NewArticle = { title, description, author_id };
      const article = articleModel.createArticle(newArticle);
      
      res.status(201).json(article);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create article' });
    }
  },

  // PUT /api/v1/articles/:id
  updateArticle: (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const { title, description, author_id } = req.body;

      if (!author_id) {
        return res.status(400).json({ error: 'author_id is required' });
      }

      if (!title && !description) {
        return res.status(400).json({ 
          error: 'At least one field (title or description) is required' 
        });
      }

      const updates: Partial<Omit<NewArticle, 'author_id'>> = {};
      if (title) updates.title = title;
      if (description) updates.description = description;

      const success = articleModel.updateArticle(id, author_id, updates);
      
      if (!success) {
        return res.status(404).json({ 
          error: 'Article not found or you are not the author' 
        });
      }
      
      res.json({ message: 'Article updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update article' });
    }
  },

  // DELETE /api/v1/articles/:id
  deleteArticle: (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const { author_id } = req.body;

      if (!author_id) {
        return res.status(400).json({ error: 'author_id is required' });
      }

      const success = articleModel.deleteArticle(id, author_id);
      
      if (!success) {
        return res.status(404).json({ 
          error: 'Article not found or you are not the author' 
        });
      }
      
      res.json({ message: 'Article deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete article' });
    }
  }
};
