import moment from 'moment';
import { Request, Response } from "express";
import { Query } from "../handlers/query";
import { UserSchema } from "../schemas/userSchema";

export const login = async (req: Request, res: Response) => {
    const user: UserSchema = req.body

    const query = (await new Query().connect()).multiple()
    let found: UserSchema[] = []
    let whereCondition = {}

    if (user.token) {
        whereCondition = {
            token: user.token
        }
    } else if (user.password && user.username) {
        whereCondition = {
            username: user.username,
            password: user.password
        }
    }

    found = await query
        .table('users as u')
        .join(
            'INNER JOIN headquarters AS h ON h.id = u.headquarter_id'
        )
        .where(whereCondition)
        .except('password', 'token')
        .select('h.id as headquarter_id', 'u.*')

    if (!!found.length) {
        const token = {
            ...found[0],
            exp: moment().unix() + (60 * 60 * 12)
        }
        const tokenString: string = Buffer.from(JSON.stringify(token), 'utf-8').toString('base64')
        console.log('token', tokenString, found[0])
        query
            .table('users')
            .where({
                id: found[0].id.toString()
            })
            .update({
                token: tokenString,
            })

        res.json({ user: { ...found[0] }, token: tokenString })
    } else {
        res.status(204)
        res.end()
    }

    query.closeConnection()

}