import { Request, Response } from "express";
import { Query } from "../handlers/query";
import { saveClient } from "./clientsController";
import { saveVehicle } from "./vehiclesController";


export const saveService = async (service: any, query: Query) => {
    const response = await query
        .table('services')
        .insert({
            vehicle_id: service.vehicle_id,
            user_id: service.user_id,
            headquarter_id: service.headquarter_id,
            price: service.price,
            description: service.description
        })
    return {...service, id: response.insertId}
}

export const proccesSaveService = async (req: Request, res: Response) => {
    const payload = req.body
    const query = (await new Query().connect()).multiple()

    const client: any = await saveClient(payload, query)

    const vehicle: any = await saveVehicle({
        ...payload, client_id: client.id
    }, query)
    
    const service = await saveService({
        vehicle_id: vehicle.id,
        user_id: req.userData.id,
        headquarter_id: req.userData.headquarter_id,
        price: payload.price,
        description: payload.description
    }, query)
    
    query.closeConnection()
    res.json({...service, plate: vehicle.plate})
}

export const listServices = async (req: Request, res: Response) => {
    const query = await new Query().connect()
    const services = await query.setRequest(req)
        .table('services as s')
        .join(
            'INNER JOIN vehicles as v ON s.vehicle_id = v.id',
            'INNER JOIN clients as c ON c.id = v.client_id'
        )
        .final('ORDER BY date DESC LIMIT 100')
        .select('*')
    
    res.json(services)
}

export const proccesSaveClient = async (req: Request, res: Response) => {
    const payload = req.body
    const query = await new Query().connect()
    const client = await saveClient(payload, query)

    res.json(client)
}

export const proccesSaveVehicle = async (req: Request, res: Response) => {
    const payload = req.body
    const query = (await new Query().connect()).multiple()
    const client: any = await saveClient(payload, query)

    const vehicle: any = await saveVehicle({
        ...payload, client_id: client.id
    }, query)
    query.closeConnection()

    res.json({...client, ...vehicle})
}