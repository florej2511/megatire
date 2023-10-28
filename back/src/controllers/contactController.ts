import {Request, Response} from "express";
import {Query} from "../handlers/query";
import {ContactUsSchema} from "../schemas";
import moment from "moment";

export const registerContactQuery = async (req: Request, res: Response) => {
    const payload: ContactUsSchema = req.body
    const query = await new Query().connect()
    const contact = await query
        .table('contact_us')
        .insert({
            ...payload
        });
    console.log(contact)
    if(!contact){
        res.status(204);
        res.end();
        return
    }
    res.json({
        status: true
    });
}

export const listContactQuery = async (req: Request, res: Response) => {
    const query = await new Query().connect()
    const messages = await query.setRequest(req)
        .table('contact_us')
        .final('ORDER BY date DESC LIMIT 100')
        .select()   
    
    if(messages.length == 0) res.json([])
    res.json(messages)
}

export const validateMessage = async (req: Request, res: Response) => {
    const query = await new Query().connect()
    const now = moment().format('YYYY-MM-DD HH:mm:ss')
    const validate = await query
        .table('contact_us')
        .where({id: req.params.id})
        .update({
            reviewed_at: now,
            reviewed_by: req.userData.id
        })

    if(validate.changedRows == 0) res.status(204)
    
    res.json({
        reviewed_at: now,
        reviewed_by: req.userData.id
    })
}