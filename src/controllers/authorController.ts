import { Request, Response } from 'express';
import { authorModel } from '../models/authorModel';
import { NewAuthor } from '../types/author';

export const authorController = {
  // GET /api/v1/authors
  getAllAuthors: (req: Request, res: Response) => {
    try {
      const authors = authorModel.getAllAuthors();
      res.json(authors);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch authors' });
    }
  },

  // GET /api/v1/authors/:id
  getAuthor: (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const author = authorModel.getAuthor(id);
      
      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }
      
      res.json(author);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch author' });
    }
  },

  // POST /api/v1/authors
  createAuthor: (req: Request, res: Response) => {
    try {
      const { name, email } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      // Check if email already exists
      const existingAuthor = authorModel.getAuthorByEmail(email);
      if (existingAuthor) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const newAuthor: NewAuthor = { name, email };
      const author = authorModel.createAuthor(newAuthor);
      
      res.status(201).json(author);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create author' });
    }
  },

  // PUT /api/v1/authors/:id
  updateAuthor: (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const { name, email } = req.body;

      if (!name && !email) {
        return res.status(400).json({ error: 'At least one field (name or email) is required' });
      }

      // Check if email already exists for another author
      if (email) {
        const existingAuthor = authorModel.getAuthorByEmail(email);
        if (existingAuthor && existingAuthor.id !== id) {
          return res.status(400).json({ error: 'Email already exists' });
        }
      }

      const updates: Partial<NewAuthor> = {};
      if (name) updates.name = name;
      if (email) updates.email = email;

      const success = authorModel.updateAuthor(id, updates);
      
      if (!success) {
        return res.status(404).json({ error: 'Author not found' });
      }
      
      res.json({ message: 'Author updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update author' });
    }
  },

  // DELETE /api/v1/authors/:id
  deleteAuthor: (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const success = authorModel.deleteAuthor(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Author not found' });
      }
      
      res.json({ message: 'Author deleted successfully' });
    } catch (error: any) {
      // Check if error is due to foreign key constraint
      if (error.message && error.message.includes('FOREIGN KEY')) {
        return res.status(400).json({ 
          error: 'Cannot delete author with existing articles' 
        });
      }
      res.status(500).json({ error: 'Failed to delete author' });
    }
  }
};
