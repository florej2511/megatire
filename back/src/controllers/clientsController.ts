import { Request, Response } from "express";
import { Query } from "../handlers/query";


export const listClients = async (req: Request, res: Response) => {
    const query = await new Query().connect()
    const clients = await query.setRequest(req)
        .table('clients')
        .final('ORDER BY registered DESC LIMIT 100')
        .select()
    
    res.json(clients)
}

export const saveClient = async (client: any, query: Query) => {
    const registered = await query
        .table('clients')
        .where({
            cc_nit: client.cc_nit
        })
        .upsert({
            fullname: client.fullname,
            email: client.email,
            cellphone: client.cellphone
        })

    return registered
}