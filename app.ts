import express from 'express';
import cookieParser from "cookie-parser"
import cors from "cors";
import connectDB from './src/config/connectDB';
import userRoutes from "./src/routes/user.route"
import postRouter from "./src/routes/post.route"
import timelineRoutes from "./src/routes/timeline.route"
import { rateLimiterUsingThirdParty } from './src/middleware/rateLimiter';

const app = express();
const port = 3000;
connectDB();



app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(rateLimiterUsingThirdParty);

app.use('/api/users', userRoutes)
app.use('/api/post', postRouter)
app.use('/api/timeline',timelineRoutes)


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});