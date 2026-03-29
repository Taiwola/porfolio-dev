import { Router } from 'express';
import { getUsersValidation, updateUserValidation } from '../middleware/validate.middleware';
import { validate } from '../common/validate';
import { deleteUser, getAllUsers, getOneUser, updateUser } from '../controller/user.controller';
import { protect } from '../middleware/auth.middleware';
import { uploadProfileFiles } from '../config/multer.config';

const router = Router();

router.get('/', protect, getUsersValidation, validate, getAllUsers);
router.get('/:id', protect,getOneUser)


router.patch('/:id', protect, updateUserValidation, validate,  uploadProfileFiles, updateUser)

router.delete('/:id', protect, deleteUser)

export default router;