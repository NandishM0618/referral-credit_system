import express, { Request, Response } from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser';
import http from 'http'
import { Server } from 'socket.io'

import authRoutes from './routes/auth.routes'
import referralRoutes from './routes/referral.routes'
import purchaseRoutes from './routes/purchase.routes'
import connectDB from './config/db';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
})

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))

connectDB();

const onlineUsers = new Map<string, string>();

io.on("connection", (socket) => {

    socket.on("register", (userId: string) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("disconnect", () => {
        for (const [userId, id] of onlineUsers.entries()) {
            if (id === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
    });
});


app.use("/api/auth", authRoutes);
app.use("/api/referral", referralRoutes)
app.use("/api/purchase", purchaseRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from TypeScript + Express backend!');
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

export { io, onlineUsers }