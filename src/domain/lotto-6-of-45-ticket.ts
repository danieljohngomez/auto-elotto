import {Ticket, TicketType} from "./ticket";

export class Lotto6Of45Ticket extends Ticket {

    private constructor(numbers: Set<number>, type: TicketType) {
        if (numbers.size !== 6) {
            throw new Error(`6/45 ticket must have exactly 6 numbers. Got ${numbers.size} numbers`);
        }
        super('6/45', numbers, type);
    }

    static createLuckyPick(): Lotto6Of45Ticket {
        const numbers = new Set<number>();
        while (numbers.size !== 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return new Lotto6Of45Ticket(numbers, TicketType.LUCKY_PICK);
    }

    static createManualPick(numbers: Iterable<number>): Lotto6Of45Ticket {
        return new Lotto6Of45Ticket(new Set(numbers), TicketType.MANUAL_PICK);
    }
}