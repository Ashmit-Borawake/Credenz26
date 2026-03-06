import express from 'express'
import { adminBuyPass, adminLogin, adminOrder, approveOrder, approvePassOrder, declineOrder, declinePassOrder, getUser, sendEmail, viewAllApprovedOrders, viewAllOrders, viewAllPassOrders } from '../controllers/admin.js'
import { authorizeRoles } from '../middlewares/admin.js'
const adminRouter = express.Router()



adminRouter.get("/viewAllOrders", authorizeRoles("ADMIN"), viewAllOrders)
adminRouter.post("/approveOrder/:orderID",authorizeRoles("ADMIN"), approveOrder)
adminRouter.post("/declineOrder/:orderID", authorizeRoles("ADMIN"), declineOrder)



adminRouter.get("/viewAllPassOrders",authorizeRoles("ADMIN"), viewAllPassOrders)
adminRouter.post("/approvePassOrder/:orderID",authorizeRoles("ADMIN"), approvePassOrder)
adminRouter.post("/declinePassOrder/:id",authorizeRoles("ADMIN"), declinePassOrder)

adminRouter.post("/buyPass",authorizeRoles("ADMIN"), adminBuyPass)
adminRouter.post("/order",authorizeRoles("ADMIN"),adminOrder)

adminRouter.get("/viewAllApprovedOrders",authorizeRoles("ADMIN","SUBADMIN"),viewAllApprovedOrders)
adminRouter.post("/sendEmail",authorizeRoles("ADMIN"),sendEmail)

adminRouter.post("/user",authorizeRoles("ADMIN","SUBADMIN"),getUser)

export { adminRouter }