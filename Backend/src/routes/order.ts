import { confirmOrder, getPrice, viewOrders } from '../controllers/order.js'
import express from 'express'
const orderRouter = express.Router()
orderRouter.post('/confirm', confirmOrder)
orderRouter.get('/price', getPrice)
orderRouter.get('/orders', viewOrders)
export { orderRouter }
