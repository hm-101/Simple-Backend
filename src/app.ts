import express from 'express';
import quoteRoute from './Routes/quoteRoute';
const app=express();

app.use(express.json());

app.use('/api',quoteRoute)


export default app;