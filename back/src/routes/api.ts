import {Express, NextFunction, Request, Response} from "express";
import {listContactQuery, registerContactQuery, validateMessage} from "../controllers/contactController";
import {login} from '../controllers/userController'
import moment from "moment";
import { Query } from "../handlers/query";
import { listVehicles } from "../controllers/vehiclesController";
import { listClients } from "../controllers/clientsController";
import { listServices, proccesSaveClient, proccesSaveService, proccesSaveVehicle } from "../controllers/serviceController";


declare global {
    namespace Express {
        interface Request {
            userData: any
        }
    } 
}

const middleware = async (req: Request, res: Response, next: NextFunction) => {
    req.userData = {} as any
    const token = req.headers['authorization'] ?? null

    if(!token){
        res.status(401)
        res.json({
            message: 'Token is not set.'
        })
        return
    }
    const tokenShort = token.replace('Bearer ', '')
    const tokenString = Buffer.from(token.replace('Bearer ', ''), 'base64').toString('utf-8')
    const query = await new Query().connect()
    const exists: any[] = await query
        .table('users')
        .where({token: tokenShort})
        .select()

    if(exists.length == 0 ){
        res.status(401)
        res.json({
            message: 'Token no valid, maybe is another user connected.'
        })
        return
    }
    const tokenObject: any = {
        ...JSON.parse(tokenString)
    }
    
    if(tokenObject.exp < moment().unix()){
        res.status(401)
        res.json({
            message: 'Token is expired. Login again please.'
        })
        return
    }

    req.userData = {...exists[0], ...tokenObject}
    next()
}

export default (app: Express) => {
    app.post('/api/contact', registerContactQuery)
    app.get('/api/messages', middleware, listContactQuery)
    app.post('/api/messages/:id', middleware, validateMessage)

    app.post('/api/user/login', login)

    app.get('/api/vehicles', middleware, listVehicles)
    app.post('/api/vehicles', middleware, proccesSaveVehicle)

    app.get('/api/clients', middleware, listClients)
    app.post('/api/clients', middleware, proccesSaveClient)

    app.post('/api/services', middleware, proccesSaveService)
    app.get('/api/services', listServices)
}