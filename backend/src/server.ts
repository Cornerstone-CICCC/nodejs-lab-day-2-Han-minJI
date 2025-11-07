// Create your server
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors' // It allowsfronent to communicate wtih bakcend
import cookieSession from 'cookie-session'
import dotenv from 'dotenv'
dotenv.config()
import userRouter from './routes/user.routes'


// create server
const app = express()

// Middleware
app.use(cors({
  origin: "http://localhost:4321", // Astro url
  credentials: true // Allow cookies from frontend
}))
if (!process.env.COOKIE_PRIMARY_KEY || !process.env.COOKIE_SECONDARY_KEY) {
  throw new Error("Missing cookie keys!")
}
app.use(cookieSession({
  name: "session",
  keys: [
    process.env.COOKIE_PRIMARY_KEY,
    process.env.COOKIE_SECONDARY_KEY
  ],
  maxAge: 3 * 60 * 1000 // 3 mins
}))
app.use(express.json()) // Allow and parse JSON body
app.use(express.urlencoded({extended: true}))

//Routes
app.use('/', userRouter)

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: "Invalid route!"
  })
})

// Start server
const PORT = process.env.PORT
if (!PORT) {
  throw new Error("Missing port!")
}
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})