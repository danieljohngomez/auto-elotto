import {Lotto6Of55Ticket} from "../../src/domain/lotto-6-of-55-ticket";

describe('Lotto6Of55Ticket', () => {
    it('should throw an error when length of numbers is not 6', () => {
        const numbers = [1, 2, 3, 4, 5];
        expect(() => Lotto6Of55Ticket.createManualPick(numbers)).toThrowError('6/55 ticket must have exactly 6 numbers. Got 5 numbers');
    })

    it('lucky pick should create random numbers', () => {
        const ticket1 = Lotto6Of55Ticket.createLuckyPick();
        const ticket2 = Lotto6Of55Ticket.createLuckyPick();
        expect(ticket1.equals(ticket2)).toBe(false);
    })

    describe('equals()', () => {
        it('should return true when numbers are the same', () => {
            const ticket1 = Lotto6Of55Ticket.createManualPick([1, 2, 3, 4, 5, 6]);
            const ticket2 = Lotto6Of55Ticket.createManualPick([1, 2, 3, 4, 5, 6]);
            expect(ticket1.equals(ticket2)).toBe(true);
        })

        it('should return false when numbers are not the same', () => {
            const ticket1 = Lotto6Of55Ticket.createManualPick([7, 8, 9, 10, 11, 12]);
            const ticket2 = Lotto6Of55Ticket.createManualPick([1, 2, 3, 4, 5, 6]);
            expect(ticket1.equals(ticket2)).toBe(false);
        })

        it('should return true when numbers are not ordered', () => {
            const ticket1 = Lotto6Of55Ticket.createManualPick([6, 5, 4, 3, 2, 1]);
            const ticket2 = Lotto6Of55Ticket.createManualPick([1, 2, 3, 4, 5, 6]);
            expect(ticket1.equals(ticket2)).toBe(true);
        })
    })
})