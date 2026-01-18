import { Router } from 'express';
import { authorController } from '../controllers/authorController';

const router = Router();

router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthor);
router.post('/', authorController.createAuthor);
router.put('/:id', authorController.updateAuthor);
router.delete('/:id', authorController.deleteAuthor);

export default router;
