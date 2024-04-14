import {Ticket} from "../../domain/ticket";
import {Page} from "puppeteer";
import {Lotto6Of55Ticket} from "../../domain/lotto-6-of-55-ticket";
import {Config} from "../config";

export abstract class PcsoGameExecutor<TicketType extends Ticket> {
    protected constructor(readonly gameId: string,
                          protected readonly page: Page) {
    }

    abstract execute(): Promise<TicketType>;

    abstract createTicket(): Promise<TicketType>;

    /**
     * Throws an error if a ticket with the same numbers is already in progress. If it is, a lucky pick is returned instead.
     */
    protected async checkSameTicket(ticket: TicketType): Promise<void> {
        await this.page.goto(`${Config.pcsoBaseUrl()}/web/member/home`)
        const purchaseHistoryButton = await this.page.waitForSelector('.betting-btn');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await purchaseHistoryButton.click();

        const frame = await (await this.page.waitForSelector('.lott-iframe')).contentFrame();
        await frame.waitForSelector('.order-item-container');
        const orders = await frame.$$('.order-item-container');

        for (const order of orders) {
            const ticketStatusElement = await order.$('.ticket-status > span:last-child');
            const ticketStatus = await ticketStatusElement.evaluate((el) => el.textContent);
            if (ticketStatus !== 'In Progress') {
                continue;
            }

            const balls = await order.$$('.order-item-ball-num');
            const numbers = await Promise.all(balls
                .map(async (ball) => {
                    const numberText = await ball.evaluate((el) => el.textContent)
                    return Number(numberText);
                }));
            const inProgressTicket = Lotto6Of55Ticket.createManualPick(numbers);
            if (inProgressTicket.equals(ticket)) {
                throw new Error('A ticket with same numbers is already in progress. Using a lucky pick instead');
            }
        }
    }
}