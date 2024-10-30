

import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import route from './routes/useRoute.js';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;
connectDB();
app.use(cors())
app.use(express.json());

app.use('/api', route);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
