import express from "express";
import { checkPass, buyPass } from "../controllers/pass.js";
const passRouter = express.Router();
passRouter.post("/", buyPass);
passRouter.get("/", checkPass);
export { passRouter };
//# sourceMappingURL=pass.js.map