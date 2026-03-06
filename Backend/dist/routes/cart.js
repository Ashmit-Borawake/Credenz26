import express from 'express';
import { addToCart, getCartItems, deleteCartItem, updateCartItem } from '../controllers/cart.js';
const cartRouter = express.Router();
cartRouter.get("/", getCartItems);
cartRouter.post("/", addToCart);
cartRouter.put("/:cartID", updateCartItem);
cartRouter.delete("/:cartID", deleteCartItem);
export { cartRouter };
//# sourceMappingURL=cart.js.map