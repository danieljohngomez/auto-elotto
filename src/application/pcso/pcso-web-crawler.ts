import puppeteer, {ElementHandle, Page} from "puppeteer";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {Config} from "../config";
import {NotificationService} from "../notification/notification-service";
import {Ticket} from "../../domain/ticket";
import {logger} from "../logger";
import {PcsoGameExecutor} from "./pcso-game-executor";
import {Pcso655GameExecutor} from "./pcso-6-55-game-executor";
import {Pcso658GameExecutor} from "./pcso-6-58-game-executor";
import _ from "lodash";
import {Pcso649GameExecutor} from "./pcso-6-49-game-executor";
import {Pcso645GameExecutor} from "./pcso-6-45-game-executor";
import {Pcso642GameExecutor} from "./pcso-6-42-game-executor";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export class PcsoWebCrawler {
    private readonly page: Page;

    private constructor(private readonly gameExecutors: PcsoGameExecutor<Ticket>[],
                        private readonly notificationService: NotificationService,
                        page: Page) {
        this.page = page;
    }

    static async create(notificationService: NotificationService): Promise<PcsoWebCrawler> {
        const browser = await puppeteer.launch({
            executablePath: Config.browserPath(),
            headless: Config.isHeadlessBrowser(),
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        const page = await browser.newPage();
        await page.setViewport({width: 1280, height: 720});
        const gameExecutors = [
            new Pcso658GameExecutor(page),
            new Pcso655GameExecutor(page),
            new Pcso649GameExecutor(page),
            new Pcso645GameExecutor(page),
            new Pcso642GameExecutor(page)
        ]
        return new PcsoWebCrawler(gameExecutors, notificationService, page);
    }

    async crawl(): Promise<void> {
        await this.page.goto(Config.pcsoBaseUrl(), {waitUntil: 'domcontentloaded'});
        await this.selectNotAMinor();

        await this.login();
        await this.checkMaxBet();
        await this.checkBalance();

        const ticket = await this.playHighestWinningGame();
        logger.info({ticket: ticket.numbers}, 'Successfully bought ticket');
        await this.notificationService.notifySuccessfulBet(ticket);
    }

    /**
     * Selects the "I'm over 18 years old" button
     */
    private async selectNotAMinor() {
        logger.info('Selecting not a minor');
        const notAMinorButton = await this.page.waitForSelector('div.msg-button');
        await notAMinorButton.click();
        await this.page.waitForSelector('div.msg-button', {hidden: true});
    }

    /**
     * Logs in to the PCSO website using the credentials specified in the config.
     */
    private async login(): Promise<void> {
        logger.info('Logging in');
        const loginButton = await this.page.waitForSelector('#app > div.main-menu > div.header-btn', {visible: true});
        await loginButton.click();

        const mobileNumberInput = await this.page.waitForSelector('#mobileNum', {visible: true});
        const passwordInput = await this.page.waitForSelector('#current-password', {visible: true});
        await mobileNumberInput.type(Config.mobileNumber(), {delay: 50});
        await passwordInput.type(Config.pin(), {delay: 50});

        const submitButton = await this.page.waitForSelector('.submit-btn', {visible: true});
        await submitButton.click();
        await this.page.waitForSelector('.submit-btn', {hidden: true})
    }

    /**
     * Checks the balance and notifies the user if it is below the threshold as specified in the config.
     */
    private async checkBalance() {
        logger.info('Checking balance');
        await this.page.goto(`${Config.pcsoBaseUrl()}/web/member/home`, {waitUntil: 'domcontentloaded'})
        await this.page.waitForFunction(() => {
            const balanceText = document.querySelector('span.number.refresh-balance').textContent
            const balance = Number(balanceText);
            return !isNaN(balance);
        });

        const balance = await this.page.$eval('span.number.refresh-balance', el => Number(el.textContent));
        logger.info(`Balance: ${balance}`)
        if (balance <= Config.lowBalanceThreshold()) {
            await this.notificationService.notifyLowBalance(balance);
        }
    }

    /**
     * Checks the number of bets placed today and throws an error if it exceeds the maximum number of bets allowed per day as specified in the config.
     */
    private async checkMaxBet(): Promise<void> {
        logger.info('Checking max bet');
        await this.page.goto(`${Config.pcsoBaseUrl()}/web/member/home`, {waitUntil: 'networkidle2'})
        const purchaseHistoryButton = await this.page.waitForSelector('.betting-btn', {visible: true});
        await purchaseHistoryButton.click();

        await this.page.waitForFrame(async (frame) => (await frame.title()) === 'Lottery');
        const iframe = await this.page.$('iframe');
        const frame = await iframe.contentFrame()
        await frame.waitForSelector('.order-bet-time');
        const bets = await frame.$$('.order-bet-time > span');
        const betDateTexts = await Promise.all(bets.map(async (bet) => bet.evaluate((el) => el.textContent)));
        const betDates = betDateTexts
            .map((betDateText) => betDateText.split(' ')[1]) // extract the date, expecting format: SUN 14-APR-24 16:44
            .map((betDateText) => this.rawDateTextToDate(betDateText));

        const today = dayjs().tz('Asia/Manila');
        const numberOfTodayBets = betDates
            .filter((betDate) => today.year() === betDate.year())
            .filter((betDate) => today.month() === betDate.month())
            .filter((betDate) => today.date() === betDate.date())
            .length

        const maxBetsPerDay = Config.maxBetsPerDay();
        if (numberOfTodayBets >= maxBetsPerDay) {
            throw new Error(`Reached max bets for today. ${numberOfTodayBets}/${maxBetsPerDay} bets already placed.`)
        }
    }

    /**
     * Plays the game with the highest winning price
     */
    private async playHighestWinningGame(): Promise<Ticket> {
        await this.page.goto(`${Config.pcsoBaseUrl()}/web`, {waitUntil: 'domcontentloaded'});
        await this.page.waitForSelector('.results-item');
        const games = await this.page.$$('.results-item');
        let highestWinningGameAndPrice: { game: ElementHandle, price: number } = null;
        for (const game of games) {
            const priceText = await game.$eval('.results-content > .item-bonus', el => el.textContent);
            const price = Number(priceText.replace(/\D/g, ''));
            if (_.isNil(highestWinningGameAndPrice) || price > highestWinningGameAndPrice.price) {
                highestWinningGameAndPrice = {game, price};
            }
        }

        if (!highestWinningGameAndPrice) {
            throw new Error('No games found');
        }

        const gameId = await highestWinningGameAndPrice.game.$eval('.results-icon > img', el => el.getAttribute('alt'));
        const gameExecutor = this.gameExecutors.find((executor) => executor.gameId === gameId);
        if (!gameExecutor) {
            throw new Error(`No game executor found for game id = ${gameId}`);
        }

        logger.info(`Playing game id ${gameId}`);
        return await gameExecutor.execute();
    }

    /**
     * Converts a raw date text to a dayjs date object.
     * Supported formats:
     *   14-APR-24 16:44
     *   14-APR-24
     */
    private rawDateTextToDate(rawDateText: string): dayjs.Dayjs {
        const formattedDateText = rawDateText.toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase());
        const format = rawDateText.includes(':') ? 'DD-MMM-YY HH:mm' : 'DD-MMM-YY';
        return dayjs(formattedDateText, format).tz('Asia/Manila');
    }
}