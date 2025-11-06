import express, { Request, Response } from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser';

import authRoutes from './routes/auth.routes'
import referralRoutes from './routes/referral.routes'
import connectDB from './config/db';

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/referral", referralRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from TypeScript + Express backend!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
