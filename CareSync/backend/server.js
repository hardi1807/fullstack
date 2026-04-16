import 'dotenv/config'
import express from "express";
import cors from 'cors'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174","http://localhost:5175"],
  credentials: true
}));

app.options("*", cors({
  origin: ["http://localhost:5173", "http://localhost:5175"],
  credentials: true
}));

app.use(express.json());
/*app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174','http://localhost:5175', 'https://adminprescriptodr.vercel.app', 'https://prescriptoapp-wheat.vercel.app'],
  credentials: true
})) */



// Body parser
app.use(express.json());


// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

if (!process.env.VERCEL && !process.env.NETLIFY) {
  app.listen(port, () => console.log(`Server started on PORT:${port}`))
}





export default app
