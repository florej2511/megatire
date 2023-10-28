import nodemailer from 'nodemailer'
import { MailOptions } from 'nodemailer/lib/json-transport'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { env } from 'process'
import { compile } from 'handlebars'
import { readFileSync } from 'fs'
import { Server, Socket } from 'socket.io'
import { Io } from './socket'

export class Mailer {
    private transportOptions: SMTPTransport.Options
    private transporter: nodemailer.Transporter

    private toEmails: string[] = []
    private attached: any[] = []
    private mailOptions: MailOptions = {}
    private notifiable: boolean = false
    private socket_id: string
    private notification: any

    constructor() {
        this.transportOptions = {
            host: env.MAIL_HOST,
            port: parseInt(env.MAIL_PORT),
            auth: {
                user: env.MAIL_USER,
                pass: env.MAIL_PASS
            }
        }
        this.transporter = nodemailer.createTransport(this.transportOptions)
    }

    private async readHTMLtemplate(path) {
        return await readFileSync(path, { encoding: 'utf-8' })
    }

    public async send(): Promise<boolean> {
        const send: boolean = await new Promise((resolve) => {
            this.transporter.sendMail(this.mailOptions, (err, succ) => {
                if (err) {
                    console.error('Mailing error: ', err)
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })

        if (send && this.notifiable) {
            const io = Io.getInstance()

            io.to(this.socket_id).emit('notification', this.notification ?? {
                title: 'Your email has been sent',
                dscp: ''
            })
        }

        return send
    }

    public to(...to: string[]) {
        to.forEach((to) => {
            this.toEmails.push(to)
        })
        this.mailOptions.to = this.toEmails
        return this
    }

    public subject(subject: string) {
        this.mailOptions.subject = subject
        return this
    }

    public async content(content: string, replacements: any = {}) {
        let message = content

        if (content.includes('.html')) {
            const html = await this.readHTMLtemplate(content)
            const template = compile(html)
            message = template(replacements)
        }
        this.mailOptions.html = message
        return this
    }

    public notificate(socket_id: string, notification: any) {
        this.notifiable = true
        this.socket_id = socket_id
        this.notification = notification
        return this
    }
}
