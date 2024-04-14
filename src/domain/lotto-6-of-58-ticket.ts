import {Ticket, TicketType} from "./ticket";

export class Lotto6Of58Ticket extends Ticket {

    private constructor(numbers: Set<number>, type: TicketType) {
        if (numbers.size !== 6) {
            throw new Error(`6/58 ticket must have exactly 6 numbers. Got ${numbers.size} numbers`);
        }
        super('6/58', numbers, type);
    }

    static createLuckyPick(): Lotto6Of58Ticket {
        const numbers = new Set<number>();
        while (numbers.size !== 6) {
            numbers.add(Math.floor(Math.random() * 58) + 1);
        }
        return new Lotto6Of58Ticket(numbers, TicketType.LUCKY_PICK);
    }

    static createManualPick(numbers: Iterable<number>): Lotto6Of58Ticket {
        return new Lotto6Of58Ticket(new Set(numbers), TicketType.MANUAL_PICK);
    }
}