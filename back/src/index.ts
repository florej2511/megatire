import express, { Express, Request, Response, json } from 'express';
import { routeHandler } from "./utils/routesHandler";
import { StaticFile } from "./schemas/RouteHandler";
import api from "./routes/api";
import cors from 'cors'
import { join, resolve } from 'path';

const app: Express = express();
const port: number = 3050;

app.use(json());
app.use(cors({
    origin: '*'
}))
app.use('/public', express.static(routeHandler.getStaticRoot()))
app.use('/assets', express.static(resolve(__dirname, '../..', 'app', 'dist', 'assets'), {extensions: ["js"]}))

app.use('/dashboard', (req: Request, res: Response) => res.sendFile(join(__dirname, '../..', 'app', 'dist', 'index.html')))
app.use('/clientes', (req: Request, res: Response) => res.sendFile(join(__dirname, '../..', 'app', 'dist', 'index.html')))
app.use('/dashboard/*', (req: Request, res: Response) => res.sendFile(join(__dirname, '../..', 'app', 'dist', 'index.html')))



app.get('/', (req: Request, res: Response) => {
    res.sendFile(routeHandler.getStaticResource(StaticFile.INDEX))
});
app.get('/sedes', (req: Request, res: Response) => {
    res.sendFile(routeHandler.getStaticResource(StaticFile.HEAD))
});
app.get('/servicios', (req: Request, res: Response) => {
    res.sendFile(routeHandler.getStaticResource(StaticFile.SERVICES))
});
app.get('/contacto', (req: Request, res: Response) => {
    res.sendFile(routeHandler.getStaticResource(StaticFile.CONTACT))
});
app.get('/conocenos', (req: Request, res: Response) => {
    res.sendFile(routeHandler.getStaticResource(StaticFile.ABOUT))
});

app.get('/admin/*?', () => {

})
try {
    api(app);
}catch(err){
    console.error('Error in apis: ', err)
}

app.listen(port, () => {
    console.log(`On port: ${port}`)
});