import {Ticket, TicketType} from "./ticket";

export class Lotto6Of55Ticket extends Ticket {

    private constructor(numbers: Set<number>, type: TicketType) {
        if (numbers.size !== 6) {
            throw new Error(`6/55 ticket must have exactly 6 numbers. Got ${numbers.size} numbers`);
        }
        super('6/55', numbers, type);
    }

    static createLuckyPick(): Lotto6Of55Ticket {
        const numbers = new Set<number>();
        while (numbers.size !== 6) {
            numbers.add(Math.floor(Math.random() * 55) + 1);
        }
        return new Lotto6Of55Ticket(numbers, TicketType.LUCKY_PICK);
    }

    static createManualPick(numbers: Iterable<number>): Lotto6Of55Ticket {
        return new Lotto6Of55Ticket(new Set(numbers), TicketType.MANUAL_PICK);
    }
}