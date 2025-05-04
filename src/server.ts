import mongoose from 'mongoose';
import dotenv from 'dotenv';

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1); 
})
dotenv.config({path:'./config.env'});

const DB=process.env.DATABASE?.replace('<PASSWORD>',process.env.DATABASE_PASSWORD as string);

mongoose.connect(DB as string).then(()=>{
    console.log('DB connection successful')
})

import app from './app';

const PORT=process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
})