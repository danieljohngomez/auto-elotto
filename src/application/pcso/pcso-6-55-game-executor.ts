import {PcsoGameExecutor} from "./pcso-game-executor";
import {Ticket, TicketType} from "../../domain/ticket";
import {Page} from "puppeteer";
import {Lotto6Of55Ticket} from "../../domain/lotto-6-of-55-ticket";
import {Config} from "../config";

export class Pcso655GameExecutor extends PcsoGameExecutor<Lotto6Of55Ticket> {
    constructor(page: Page) {
        super('PCSO655G', page);
    }

    async createTicket(): Promise<Lotto6Of55Ticket> {
        if (Config.ticketType() === TicketType.LUCKY_PICK) {
            return Lotto6Of55Ticket.createLuckyPick();
        }
        if (Config.ticketType() === TicketType.MANUAL_PICK) {
            return Lotto6Of55Ticket.createManualPick(Config.ticketNumbers());
        }
        throw new Error(`Unhandled ticket type: ${Config.ticketType()}`);
    }

    async execute(): Promise<Lotto6Of55Ticket> {
        const ticket = await this.createTicket();
        await this.checkSameTicket(ticket);
        await this.selectGame();
        await this.selectNumbers(ticket);
        await this.buyTicket();
        return ticket;
    }

    private async selectGame(): Promise<void> {
        await this.page.goto(`${Config.pcsoBaseUrl()}/web`)
        const play655 = await this.page.waitForSelector(`img[alt="${this.gameId}"]`);
        await play655.click();
    }

    private async selectNumbers(ticket: Ticket): Promise<void> {
        const gameFrame = await (await this.page.waitForSelector('.lott-iframe')).contentFrame();
        const cardsSelector = '.card-box.betting-card';
        await gameFrame.waitForSelector(cardsSelector);
        const cards = await gameFrame.$$(cardsSelector);

        const ballsSelector = '.ball';
        await cards[0].waitForSelector(ballsSelector);
        const balls = await cards[0].$$(ballsSelector);
        if (balls.length !== 55) {
            throw new Error(`Invalid number of balls, expecting 55 but got ${balls.length}`);
        }

        await new Promise(resolve => setTimeout(resolve, 3000));

        for (const number of ticket.numbers) {
            await balls[number - 1].click();
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        const lockButton = await cards[0].waitForSelector('.lock');
        await lockButton.click();
    }

    private async buyTicket(): Promise<void> {
        const gameFrame = await (await this.page.waitForSelector('.lott-iframe')).contentFrame();

        const buyButton = await gameFrame.waitForSelector('.betting-button');
        await buyButton.click();

        const termsCheckBox = await gameFrame.waitForSelector('#termsChecked');
        await termsCheckBox.click();

        const confirmButton = await gameFrame.waitForSelector('.responsible-gambling-confirm-button');
        await confirmButton.click();

        const actionButtons = await gameFrame.$$('.confirm-box-action');
        const actionButtonsWithText = actionButtons
            .map(async (button, index) => {
                const text = await button.evaluate((el) => el.textContent);
                return {text, button};
            });
        const secondBuyButton = (await Promise.all(actionButtonsWithText))
            .find((button) => button.text === 'Buy Now');
        await secondBuyButton.button.click();
    }
}