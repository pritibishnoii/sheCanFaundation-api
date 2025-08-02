import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/index.js';
import cors from 'cors';
import internRoutes from './routes/internRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

app.use('/api', internRoutes);
app.use('/api', userRoutes);
