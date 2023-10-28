import { createPool, OkPacket, Pool, PoolConnection } from 'mysql'
import { env } from 'process'
import { join } from 'path'
import * as dotenv from 'dotenv'
import { Request, Response } from 'express'
dotenv.config({ path: join(__dirname, '../../', '.env') })

class DataBase {
    public readonly host: string = env.DB_HOST;
    public readonly user: string = env.DB_USER;
    public readonly password: string = env.DB_PASSWORD;
    public readonly database: string = env.DB_NAME;
    public readonly port: number = parseInt(env.DB_PORT);
    private response: Response;
    private request: Request;
}

export class DataBasePool extends DataBase {
    public pool: Pool;

    constructor() {
        super();
        this.pool = createPool({
            connectionLimit: 20,
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
            port: this.port,
            connectTimeout: 60 * 60 * 1000,
            acquireTimeout: 60 * 60 * 1000,
            timeout: 60 * 60 * 1000,
        });
    }

    public async read<T>(query: string, conn?: PoolConnection): Promise<T | null> {
        return await new Promise((res, rej) => {
            if (conn) {
                conn.query(query, (err, rta) => {
                    if (err) console.error('READING ERR: ', query, '\n', err), res(null);
                    res(rta);
                });
            } else {
                this.pool.query(query, (err, rta) => {
                    if (err) console.error('READING ERR: ', query, '\n', err), res(null);
                    res(rta);
                });
            }
        });
    }
}

export const usePool = new DataBasePool();