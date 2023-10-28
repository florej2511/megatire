import { Server } from "socket.io";

export class Io{
    private static instance: Server;

    public static createInstance(server: Server){
        this.instance = server
    }

    public static getInstance(){
        return this.instance
    }
}