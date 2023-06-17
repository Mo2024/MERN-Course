import express from 'express';
import * as UserContoller from "../controllers/users";

const router = express.Router();

router.get('/', UserContoller.getAuthenticatedUser);
router.post('/signup', UserContoller.signUp);
router.post('/login', UserContoller.login);
router.post('/logout', UserContoller.logout);

export default router;