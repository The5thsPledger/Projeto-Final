import * as dotenv from 'dotenv';
dotenv.config();
console.log(
    'dotenv loaded', 
    process.env.REDIS_HOST, process.env.REDIS_PORT
);