import _ from "lodash";

export enum TicketType {
    MANUAL_PICK = 'MANUAL_PICK',
    LUCKY_PICK = 'LUCKY_PICK'
}

export abstract class Ticket {
    protected constructor(readonly name: string,
                          readonly numbers: Set<number>,
                          readonly type: TicketType
    ) {
    }

    equals(ticket: Ticket): boolean {
        return _.isEqual(this.numbers, ticket.numbers);
    }
}