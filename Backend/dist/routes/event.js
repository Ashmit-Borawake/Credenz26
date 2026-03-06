import express from 'express';
import { addEvent, getEvent, updateEvent } from '../controllers/event.js';
const eventRouter = express.Router();
eventRouter.post("/", addEvent);
eventRouter.get("/", getEvent);
eventRouter.put("/:id", updateEvent);
export { eventRouter };
//# sourceMappingURL=event.js.map