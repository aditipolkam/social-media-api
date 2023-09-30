import express from 'express';
import cookieParser from "cookie-parser"
import cors from "cors";
import connectDB from './src/config/connectDB';
import userRoutes from "./src/routes/user.route"
import postRouter from "./src/routes/post.route"

const app = express();
const port = 3000;
connectDB();



app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api/users', userRoutes)
app.use('/api/post', postRouter)


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});