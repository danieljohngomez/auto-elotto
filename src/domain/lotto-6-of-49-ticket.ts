import {Ticket, TicketType} from "./ticket";

export class Lotto6Of49Ticket extends Ticket {

    private constructor(numbers: Set<number>, type: TicketType) {
        if (numbers.size !== 6) {
            throw new Error(`6/49 ticket must have exactly 6 numbers. Got ${numbers.size} numbers`);
        }
        super('6/49', numbers, type);
    }

    static createLuckyPick(): Lotto6Of49Ticket {
        const numbers = new Set<number>();
        while (numbers.size !== 6) {
            numbers.add(Math.floor(Math.random() * 49) + 1);
        }
        return new Lotto6Of49Ticket(numbers, TicketType.LUCKY_PICK);
    }

    static createManualPick(numbers: Iterable<number>): Lotto6Of49Ticket {
        return new Lotto6Of49Ticket(new Set(numbers), TicketType.MANUAL_PICK);
    }
}