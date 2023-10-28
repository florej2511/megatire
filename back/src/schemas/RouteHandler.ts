export interface RouteHandlerClass {
    getStaticResource(filename: StaticFile): string
}

export enum StaticFile {
    INDEX = 'index.html',
    ABOUT = 'about.html',
    HEAD = 'headquarters.html',
    SERVICES = 'services.html',
    CONTACT = 'contact.html'
}