import mysql from 'mysql2/promise';
import 'dotenv/config';

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true
});

//console.log("hello",process.env.DB_HOST, process.env.DB_USERNAME,process.env.DB_PASSWORD, process.env.DB_DATABASE )

export default connection;