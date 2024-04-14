import {NotificationService} from "./notification-service";
import nodemailer from "nodemailer";
import {Config} from "../config";
import {Ticket, TicketType} from "../../domain/ticket";
import {logger} from "../logger";
import * as fs from "fs";
import _ from "lodash";
import dayjs from "dayjs";

export class GmailNotificationService implements NotificationService {
    private readonly transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: Config.gmailCredentials().email,
                pass: Config.gmailCredentials().password,
            },
        });
    }

    public async notifySuccessfulBet(ticket: Ticket): Promise<void> {
        const ticketNumbers = Array.from(ticket.numbers).join(' ');
        const html = fs.readFileSync('src/application/notification/html/successful-bet.html', 'utf8')
            .replace('{game}', ticket.name)
            .replace('{type}', _.startCase(ticket.type.toLowerCase()))
            .replace('{numbers}', Array.from(ticket.numbers).join(' '))
            .replace('{date}', dayjs().format('MM-DD-YYYY hh:mm A'));

        await this.sendEmail('eLotto: Bet Successful', html);
        logger.info(`Bet successful: ${ticketNumbers}`);
    }

    public async notifyLowBalance(balance: number): Promise<void> {
        await this.sendEmail('eLotto: Low Balance', `Balance: ${balance}`);
        logger.info({ balance }, 'Low balance');
    }

    private sendEmail(subject: string, htmlBody: string): Promise<void> {
        return this.transporter.sendMail({
            from: Config.gmailCredentials().email,
            to: Config.notificationRecipientEmailAddress(),
            subject,
            html: htmlBody
        });
    }
}