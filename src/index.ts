import express, { Request, Response } from 'express';
import './database/db'; // Initialize database
import articleRoutes from './routes/articleRoutes';
import authorRoutes from './routes/authorRoutes';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript + SQLite Server');
});

app.get('/api/v1/example', (req: Request, res: Response) => {
  res.json({ message: 'Example endpoint working!' });
});

app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/authors', authorRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
