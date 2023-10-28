import { Request, Response } from "express";
import { Query } from "../handlers/query";

export const listVehicles = async (req: Request, res: Response) => {
    const query = await new Query().connect()
    const vehicles = await query
        .setRequest(req)
        .table('vehicles as v')
        .join('INNER JOIN clients as c ON c.id = v.client_id')
        .select('c.*', 'c.id as client_id', 'v.*')

    if(vehicles.length == 0) {res.json([]); return}
    res.json(vehicles)
}

export const saveVehicle = async (vehicle: any, query: Query) => {
    const registered = await query
        .table('vehicles')
        .where({
            plate: vehicle.plate
        })
        .upsert({
            tipo: vehicle.tipo,
            client_id: vehicle.client_id
        })

    return registered
}
