export interface baseConfig {
    all?: boolean
}

export type superString = {
    [key: string]: string
}

export interface ContactUsSchema{
    fullname: string;
    cellphone: string;
    email: string;
    content: string;
    date?: string;
}
