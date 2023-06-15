import express from 'express';
import * as NotesContoller from "../controllers/notes";

const router = express.Router();

router.get('/', NotesContoller.getNotes);
router.get('/:id', NotesContoller.getNote);
router.post('/', NotesContoller.createNote);
router.patch('/:id', NotesContoller.updateNote);
router.delete('/:id', NotesContoller.deleteNote);

export default router;