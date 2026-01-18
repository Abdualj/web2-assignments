import { Router } from 'express';
import { articleController } from '../controllers/articleController';

const router = Router();

router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticle);
router.get('/author/:authorId', articleController.getArticlesByAuthor);
router.post('/', articleController.createArticle);
router.put('/:id', articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);

export default router;
