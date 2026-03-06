import express from 'express'
import 'dotenv/config'
import helmet from "helmet";
import { authRouter } from './routes/auth.js'
import { eventRouter } from './routes/event.js'
import { cartRouter } from './routes/cart.js'
import { passRouter } from './routes/pass.js'
import { profileRouter } from './routes/profile.js'
import cookieParser from 'cookie-parser'
import { getEvent } from './controllers/event.js'
import cors from 'cors'
import { authenticate } from './middlewares/auth.js'
import { orderRouter } from './routes/order.js'
import { adminRouter } from './routes/admin.js'
import { adminLogin } from './controllers/admin.js'
import { feedbackRouter } from './routes/feedback.js'
import { rateLimit } from 'express-rate-limit';
import { authorizeRoles } from './middlewares/admin.js';

const app = express()
const PORT = process.env.PORT || 3000


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());


app.use(
  cors({
    origin: ["https://credenz.co.in","https://admin-credenz.vercel.app", "http://localhost:5173","http://localhost:4173"], // exact frontend origin
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false, // frontend handles CSP
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100  // Limit each IP to 100 requests per window
});
app.use(limiter);


app.use(cookieParser())
app.set("trust proxy", 1);
app.use("/auth",authRouter)

app.post("/admin/login", adminLogin)

app.get("/event",getEvent)
app.use("/feedback",feedbackRouter)

app.use(authenticate)

app.use("/admin/event",authorizeRoles("ADMIN"), eventRouter)

app.use("/cart", cartRouter)

app.use("/user",orderRouter)

app.use("/pass",passRouter)

app.use("/profile",profileRouter)

app.use("/admin",adminRouter)

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express + TypeScript!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})