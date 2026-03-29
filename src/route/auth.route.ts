import { Router } from 'express';
import { loginUserValidation, registerValidation, resetPasswordValidation } from '../middleware/validate.middleware';
import { validate } from '../common/validate';
import { createUser } from '../controller/user.controller';
import { forgetPassword, loginUser, resetPassword } from '../controller/auth.controller';
import { resetPasswordMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', registerValidation, validate, createUser);
router.post('/login', loginUserValidation, validate, loginUser);

router.post('/forget-password', forgetPassword)
router.post('/reset', resetPasswordMiddleware, resetPasswordValidation, validate, resetPassword)


export default router