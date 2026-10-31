import {Router} from 'express';
import { registerController , loginController, meController, refreshController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { registerSchema , loginSchema } from '../schemas/auth.schemas.js';
import { authenticate } from '../middleware/authenticate.js';
import { logoutController } from '../controllers/auth.controller.js';
import { forgetPassword } from '../controllers/passwordReset.controller.js';
import { forgetPasswordSchema } from '../schemas/auth.schemas.js';
import { resetPasswordController } from '../controllers/passwordReset.controller.js';
import { resetPasswordSchema } from '../schemas/auth.schemas.js';


const router = Router();

router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);
router.get('/me', authenticate, meController);
router.post('/refresh', refreshController);
router.post("/logout",logoutController);
router.post("/forget-password", validate(forgetPasswordSchema), forgetPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPasswordController,);



export default router;