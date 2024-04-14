import {Ticket} from "../../domain/ticket";

export interface NotificationService {
    notifySuccessfulBet(ticket: Ticket): Promise<void>;
    notifyLowBalance(balance: number): Promise<void>;
}