import express from "express";
import 'dotenv/config.js'
import { connectToDB } from "./db.js";
import { notFound } from "./middleware/notFound.js";
import { ErrorHandler } from "./middleware/ErrorHandler.js";
import cors from 'cors'
import morgan from 'morgan'
import dns from 'dns';
import cookieParser from "cookie-parser";
import { AuthRouter } from "./routes/auth/auth.route.js";





dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

//connect DB 

connectToDB()

const corsorigin = process.env.CORSORIGIN

const app = express()
app.use(cookieParser());

app.use(express.json())
app.use(morgan('dev'))
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//routes

app.use("/auth", AuthRouter);

app.use(notFound)
app.use(ErrorHandler)

const PORT =process.env.PORT

app.listen(PORT,()=>{
    console.log('server is running')
})
