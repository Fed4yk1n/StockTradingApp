import express from 'express';
import { register, login, getProfile, getAllUsers, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.get('/all', authenticate, isAdmin, getAllUsers);
router.put('/update', authenticate, updateUser);
router.delete('/delete/:id', authenticate, isAdmin, deleteUser);

export default router;
