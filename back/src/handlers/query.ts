import {OkPacket, PoolConnection} from "mysql";
import {superString} from "../schemas";
import {usePool} from "./database";
import { Request } from "express";

export class Query {
    // Data
    private _connection: PoolConnection
    private _table: string
    private _conditions: superString = {}
    private _join: string[] = []
    private _orders: string = ''
    private _except: string[] = []
    // Behavior
    private _upsert: boolean = false
    private _multiple: boolean = false
    public _upserted: 'insert' | 'update'
    private _request: Request

    public async connect() {
        this._connection = await new Promise((res, rej) => {
            usePool.pool.getConnection((err, conn) => {
                if (err) console.error('Not connection available')
                res(conn)
            })
        })
        return this
    }

    validateParam(str: string): void {
        if (str.toString().split(';').length > 1) {
            console.error('Dangerous parameter: ', str);
            this.closeConnection();
        }
    }

    setRequest(req: Request): Query{
        this._request = req
        return this
    }

    private validateMultiple() {
        if (!this._multiple) {
            this._connection.release()
        } else if (this._upsert) {

        } else {
            this._table = ''
            this._conditions = {}
            this._join = []
            this._orders = ''
        }
    }

    public transaction(): Query {
        this._connection.beginTransaction()
        return this
    }

    public rollback(no: boolean = false) {
        this._connection.rollback()
        if (no) return
        this.closeConnection()
    }

    public commit(no: boolean = false) {
        this._connection.commit()
        if (no) return
        console.log('here')
        this.closeConnection()
    }

    public closeConnection() {
        this._connection.release()
    }

    public multiple(): Query {
        this._multiple = true
        return this
    }

    public except(...except: string[]): Query {
        this._except = except
        return this
    }

    public final(order): Query {
        this._orders = order
        return this
    }

    public join(...join: string[]): Query {
        this._join = join
        return this
    }

    public where(conditions: superString): Query {
        this._conditions = conditions
        return this
    }

    public table(table: string): Query {
        this._table = table
        return this
    }

    private inLineCondition(key: string, val: string): string[] {
        let arr = []
        if (key.includes('$transaction$')) {
            arr.push(val)
        } else if (key.includes('!')) {
            const aux = key.replace('!', '')

            if (val.includes('%%') && val.includes('.')) {
                arr.push(` ${aux} not like '${val.replace('%%', '')}'`)
            } else if (val.includes('%%')) {
                arr.push(` ${aux} not like '%${val.replace('%%', '')}%' `)
            } else {
                arr.push(` ${aux} != '${val}'`)
            }

        } else {
            if (val.includes('null')) {
                arr.push(` ${key} IS NULL `)
            } else if (val == '0') {
                arr.push(` ${key} = 0 `)
            } else {
                if (val.includes('%%')) {
                    arr.push(` ${key} like '%${val.replace('%%', '')}%' `)
                } else {
                    arr.push(` ${key} = '${val}'`)
                }
            }
        }
        return arr
    }

    private conditionMaker(): string {
        let str = ''
        if (Object.keys(this._conditions).length > 0) {
            str += ' WHERE '
            const arr = []

            for (const [index, key] of Object.keys(this._conditions).entries()) {
                this.validateParam(key)
                const val = this._conditions[key].toString()
                this.validateParam(val)
                if (val.split(',').length > 1) {
                    const localVal = val.split(',')
                    const localArr = []//aquí
                    for (const [index, vl] of localVal.entries()) {
                        localArr.push(this.inLineCondition(key, vl))
                    }
                    arr.push('(' + localArr.join(' or ') + ')')
                } else if (key.split(',').length > 1) {
                    const localKey = key.split(',')
                    const localArr = []
                    for (const [index, keyVal] of localKey.entries()) {
                        localArr.push(this.inLineCondition(keyVal, val))
                    }
                    arr.push('(' + localArr.join(' or ') + ')')
                } else {
                    arr.push(this.inLineCondition(key, val))
                }

            }
            str += arr.join(' and ')
        }
        return str
    }

    private makeSelectQuery(selector: string[] = []) {
        let joins = this._join.join(' ')
        let selectors = '*'
        if(this._request){
            this._conditions = {...this._request.query} as superString
        }
        if (selector.length > 0) {
            selectors = selector.join(',')
        }

        let str = `SELECT ${selectors} FROM ${this._table} ${joins} `

        str += this.conditionMaker()

        str += this._orders
        return str
    }

    private makeUpdateQuery(updates: superString): string {
        let setter = []
        for (const [index, key] of Object.keys(updates).entries()) {
            this.validateParam(key)
            const val = updates[key].toString()
            this.validateParam(val)
            if (val.includes('$op$')) {
                setter.push(`${key} = ${key} ${val.replace('$op$', '')}`)
            } else {
                setter.push(`${key} = '${val}'`)
            }
        }
        const values = setter.join(', ')
        const ifs = this.conditionMaker()
        return `UPDATE ${this._table} SET ${values} ${ifs}`
    }

    private makeInsertQuery(insertion: superString): string {
        const headers = []
        const values = []

        for (const [index, key] of Object.keys(insertion).entries()) {
            this.validateParam(key)
            let val = insertion[key]
            this.validateParam(val)
            headers.push(key)
            if (val.toString().includes('$op$')) {
                val = val.replaceAll(' ', '').replaceAll('+', '').replaceAll('-', '')
            }
            values.push(`'${val}'`)
        }

        return `INSERT INTO ${this._table} (${headers.join(', ')}) VALUES (${values.join(', ')})`
    }

    private makeDeleteQuery(): string {
        const ifs = this.conditionMaker()
        return `DELETE FROM ${this._table} ${ifs}`
    }

    public async select<T>(
        ...selector: string[]
    ): Promise<T[]> {

        const str = this.makeSelectQuery(selector)
        // console.log(str)
        const response: any[] = await usePool.read<any>(str, this._connection)
        this.validateMultiple()
        response.map((r: T) => {
            this._except.forEach(e => {
                delete r[e]
            })
            return r
        })
        return response 
    }

    public async delete(): Promise<OkPacket> {
        const str = this.makeDeleteQuery()
        return await usePool.read<OkPacket>(str, this._connection)
    }

    public async update(
        updates: superString
    ): Promise<OkPacket> {
        const str = this.makeUpdateQuery(updates)
        const response: OkPacket = await usePool.read<OkPacket>(str, this._connection)
        this.validateMultiple()
        return response
    }

    public async insert(
        insertion: superString
    ): Promise<OkPacket> {
        const str = this.makeInsertQuery(insertion)
        const response: OkPacket = await usePool.read<OkPacket>(str, this._connection)
        this.validateMultiple()
        return response
    }

    public async upsert<T>(
        upsertion: superString
    ): Promise<T> {

        const realMultiple = this._multiple
        this._upsert = true
        this.multiple()

        const there: T[] = await this.select<T>()
        if (!realMultiple) {
            this._multiple = false
        }
        this._upsert = false

        if (there.length > 0) {
            // update
            const conditions = {...this._conditions}
            const resp: OkPacket = await this.update(upsertion)
            if (resp.affectedRows == 0) {
                console.error('UPDATE upsert Error', this)
                return null
            }
            this._upserted = 'update'
            return {
                ...there[0],
                ...upsertion,
                ...conditions
            } as T
        } else {
            // insert
            delete this._conditions.id
            const toInsert = {...upsertion, ...this._conditions}
            const resp: OkPacket = await this.insert(toInsert)
            if (resp.affectedRows == 0) {
                console.error('INSERT upsert Error', this)
                return null
            }
            this._upserted = 'insert'

            return {
                ...toInsert,
                id: resp.insertId
            } as T
        }
    }


}

