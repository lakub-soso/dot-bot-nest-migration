import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: '.env' });

const prod = process.env.NODE_ENV === 'prod';

const config = {
    type: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    synchronize: false,
    logging: false,
    entities: [

    ],
    migrations: [

    ],
    subscribers: [],
    options: {
        encrypt: true,
    },
};

export default config;

export const connectionSource = new DataSource(config as DataSourceOptions);
