import express from 'express'
import { addEvent, updateEvent } from '../controllers/event.js'
const eventRouter = express.Router()


eventRouter.post("/",addEvent)


eventRouter.put("/:id",updateEvent)



export {eventRouter}
