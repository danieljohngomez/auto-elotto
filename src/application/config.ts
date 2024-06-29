import _ from 'lodash';
import {TicketType} from "../domain/ticket";

export class Config {
    static mobileNumber(): string {
        if (_.isNil(process.env.MOBILE_NUMBER)) {
            throw new Error('MOBILE_NUMBER env is not set');
        }
        return process.env.MOBILE_NUMBER;
    }

    static pin(): string {
        if (_.isNil(process.env.PIN)) {
            throw new Error('PIN env is not set');
        }
        return process.env.PIN;
    }

    static gmailCredentials(): { email: string, password: string } {
        if (_.isNil(process.env.GMAIL_NOTIFICATION_EMAIL_ADDRESS)) {
            throw new Error('GMAIL_NOTIFICATION_EMAIL_ADDRESS env is not set');
        }
        if (_.isNil(process.env.GMAIL_NOTIFICATION_EMAIL_PASSWORD)) {
            throw new Error('GMAIL_NOTIFICATION_EMAIL_PASSWORD env is not set');
        }

        return {
            email: process.env.GMAIL_NOTIFICATION_EMAIL_ADDRESS,
            password: process.env.GMAIL_NOTIFICATION_EMAIL_PASSWORD
        };
    }

    static notificationRecipientEmailAddress(): string {
        if (_.isNil(process.env.NOTIFICATION_EMAIL_ADDRESS_RECIPIENT)) {
            throw new Error('NOTIFICATION_EMAIL_ADDRESS_RECIPIENT env is not set');
        }
        return process.env.NOTIFICATION_EMAIL_ADDRESS_RECIPIENT;
    }

    static lowBalanceThreshold(): number {
        return process.env.LOW_BALANCE_THRESHOLD ? Number(process.env.LOW_BALANCE_THRESHOLD) : 50;
    }

    static isHeadlessBrowser(): boolean {
        if (_.isNil(process.env.HEADLESS_BROWSER)) {
            return false;
        }
        return process.env.HEADLESS_BROWSER === 'true'
    }

    static maxBetsPerDay(): number {
        return process.env.MAX_BETS_PER_DAY ? Number(process.env.MAX_BETS_PER_DAY) : 1;
    }

    static ticketType(): TicketType {
        const ticketType = process.env.TICKET_TYPE || TicketType.LUCKY_PICK;
        if (!Object.values(TicketType).includes(ticketType as TicketType)) {
            throw new Error(`Invalid ticket type: ${ticketType}. Must be one of ${Object.values(TicketType)}`);
        }
        return ticketType as TicketType;
    }

    static ticketNumbers(): Set<number> {
        if (Config.ticketType() !== TicketType.MANUAL_PICK) {
            return new Set<number>();
        }
        const numbers = process.env.TICKET_NUMBERS?.split(',').map((num) => Number(num));
        return new Set(numbers);
    }

    static pcsoBaseUrl(): string {
        return process.env.PCSO_BASE_URL || 'https://elotto.pcso.gov.ph';
    }

    static browserPath(): string {
        return process.env.BROWSER_PATH;
    }

    static crawlerDelay(): { from_seconds: number, to_seconds: number } {
        return {
            from_seconds: Number(process.env.CRAWLER_RANDOM_DELAY_FROM_SECONDS || -1),
            to_seconds: Number(process.env.CRAWLER_RANDOM_DELAY_TO_SECONDS || -1)
        }
    }
}