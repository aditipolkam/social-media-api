import express from 'express';
import cookieParser from "cookie-parser"

import connectDB from './src/config/connectDB';
import userRoutes from "./src/routes/user.route"

const app = express();
const port = 3000;
connectDB();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api/users', userRoutes)


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});