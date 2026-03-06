import express from 'express';
import { signup, login } from '../controllers/auth.js';
const authRouter = express.Router();
authRouter.post("/signup", signup);
authRouter.post("/login", login);
export { authRouter };
//# sourceMappingURL=auth.js.map