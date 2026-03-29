import { Router } from 'express';
import { loginUserValidation, registerValidation } from '../middleware/validate.middleware';
import { validate } from '../common/validate';
import { createUser, loginUser } from '../controller/user.controller';

const router = Router();

router.post('/register', registerValidation, validate, createUser);
router.post('/login', loginUserValidation, validate, loginUser);


export default router