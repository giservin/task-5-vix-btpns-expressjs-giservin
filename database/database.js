import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config()

const db_host = process.env.DB_HOST;
const db_user = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

const db = new Sequelize(db_name, db_user, db_password, {
    host: db_host,
    dialect: 'postgres'
});

export default db;