import { Router } from "express";
import { getFeedback } from "../controllers/feedback.js";

const feedbackRouter = Router();

feedbackRouter.post("/", getFeedback);

export { feedbackRouter };