import express from 'express';
import 'dotenv/config';
import { authRouter } from './routes/auth.js';
import { eventRouter } from './routes/event.js';
import { cartRouter } from './routes/cart.js';
import { passRouter } from './routes/pass.js';
import cookieParser from 'cookie-parser';
import { confirmOrder, getPrice } from './controllers/order.js';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieParser());
app.use((req, res, next) => {
    req.cookies.token = {
        username: "test2",
        userID: "11111111-1111-1111-1111-111111111111",
        isJunior: true
    };
    next();
});
app.use("/auth", authRouter);
app.use("/admin/event", eventRouter);
app.use("/cart", cartRouter);
app.get("/price", getPrice);
app.post("/confirm", confirmOrder);
app.use("/pass", passRouter);
// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Express + TypeScript!' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map