import {RouteHandlerClass, StaticFile} from "../schemas/RouteHandler";
import {join} from "path";

class RouteHanlder implements RouteHandlerClass{

    private staticFolder: string;

    constructor() {
        this.staticFolder = join(__dirname, '../../..', 'static');
    }

    public getStaticResource(filename: StaticFile): string {
        return join(this.staticFolder, filename);
    }

    public getStaticRoot(){
        return this.staticFolder;
    }
}

export const routeHandler = new RouteHanlder();