import request from 'supertest';
import express from 'express';
import '../database/db';
import articleRoutes from '../routes/articleRoutes';
import authorRoutes from '../routes/authorRoutes';

const app = express();
app.use(express.json());
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/authors', authorRoutes);

describe('Integration Tests', () => {
  let testAuthorId: number;
  let testArticleId: number;

  // Test Authors CRUD
  describe('Authors API', () => {
    test('GET /api/v1/authors - should return all authors', async () => {
      const response = await request(app).get('/api/v1/authors');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('POST /api/v1/authors - should create a new author', async () => {
      const newAuthor = {
        name: 'Test Author',
        email: `test${Date.now()}@example.com`
      };
      const response = await request(app)
        .post('/api/v1/authors')
        .send(newAuthor);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newAuthor.name);
      expect(response.body.email).toBe(newAuthor.email);
      testAuthorId = response.body.id;
    });

    test('GET /api/v1/authors/:id - should return a single author', async () => {
      const response = await request(app).get(`/api/v1/authors/${testAuthorId}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testAuthorId);
    });

    test('PUT /api/v1/authors/:id - should update an author', async () => {
      const updates = { name: 'Updated Test Author' };
      const response = await request(app)
        .put(`/api/v1/authors/${testAuthorId}`)
        .send(updates);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Author updated successfully');
    });

    test('POST /api/v1/authors - should fail with duplicate email', async () => {
      const duplicateAuthor = {
        name: 'Another Author',
        email: 'john.doe@example.com' // Existing email
      };
      const response = await request(app)
        .post('/api/v1/authors')
        .send(duplicateAuthor);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email already exists');
    });
  });

  // Test Articles CRUD
  describe('Articles API', () => {
    test('GET /api/v1/articles - should return all articles with author info', async () => {
      const response = await request(app).get('/api/v1/articles');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('author_name');
      expect(response.body[0]).toHaveProperty('author_email');
    });

    test('POST /api/v1/articles - should create a new article', async () => {
      const newArticle = {
        title: 'Test Article',
        description: 'This is a test article',
        author_id: testAuthorId
      };
      const response = await request(app)
        .post('/api/v1/articles')
        .send(newArticle);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newArticle.title);
      testArticleId = response.body.id;
    });

    test('GET /api/v1/articles/:id - should return a single article with author', async () => {
      const response = await request(app).get(`/api/v1/articles/${testArticleId}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testArticleId);
      expect(response.body).toHaveProperty('author_name');
      expect(response.body).toHaveProperty('author_email');
    });

    test('PUT /api/v1/articles/:id - should update article by author', async () => {
      const updates = {
        title: 'Updated Test Article',
        author_id: testAuthorId
      };
      const response = await request(app)
        .put(`/api/v1/articles/${testArticleId}`)
        .send(updates);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Article updated successfully');
    });

    test('PUT /api/v1/articles/:id - should fail when wrong author tries to update', async () => {
      const updates = {
        title: 'Unauthorized Update',
        author_id: 999 // Non-existent author
      };
      const response = await request(app)
        .put(`/api/v1/articles/${testArticleId}`)
        .send(updates);
      
      expect(response.status).toBe(404);
      expect(response.body.error).toContain('not the author');
    });

    test('GET /api/v1/articles/author/:authorId - should return articles by author', async () => {
      const response = await request(app).get(`/api/v1/articles/author/${testAuthorId}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('DELETE /api/v1/articles/:id - should delete article by author', async () => {
      const response = await request(app)
        .delete(`/api/v1/articles/${testArticleId}`)
        .send({ author_id: testAuthorId });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Article deleted successfully');
    });

    test('POST /api/v1/articles - should fail without author_id', async () => {
      const newArticle = {
        title: 'Missing Author Article',
        description: 'This should fail'
      };
      const response = await request(app)
        .post('/api/v1/articles')
        .send(newArticle);
      
      expect(response.status).toBe(400);
    });
  });

  // Test Foreign Key Constraint
  describe('Foreign Key Constraints', () => {
    test('DELETE /api/v1/authors/:id - should fail if author has articles', async () => {
      const response = await request(app).delete('/api/v1/authors/1');
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Cannot delete author');
    });

    test('DELETE /api/v1/authors/:id - should succeed if no articles', async () => {
      const response = await request(app).delete(`/api/v1/authors/${testAuthorId}`);
      expect(response.status).toBe(200);
    });
  });
});
