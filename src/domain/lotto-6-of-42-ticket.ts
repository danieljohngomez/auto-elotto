import {Ticket, TicketType} from "./ticket";

export class Lotto6Of42Ticket extends Ticket {

    private constructor(numbers: Set<number>, type: TicketType) {
        if (numbers.size !== 6) {
            throw new Error(`6/42 ticket must have exactly 6 numbers. Got ${numbers.size} numbers`);
        }
        super('6/42', numbers, type);
    }

    static createLuckyPick(): Lotto6Of42Ticket {
        const numbers = new Set<number>();
        while (numbers.size !== 6) {
            numbers.add(Math.floor(Math.random() * 42) + 1);
        }
        return new Lotto6Of42Ticket(numbers, TicketType.LUCKY_PICK);
    }

    static createManualPick(numbers: Iterable<number>): Lotto6Of42Ticket {
        return new Lotto6Of42Ticket(new Set(numbers), TicketType.MANUAL_PICK);
    }
}