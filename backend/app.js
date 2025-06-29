import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import matchRoutes from './routes/matchRoutes.js';



const app = express();


app.use(express.json())
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);


export default app;