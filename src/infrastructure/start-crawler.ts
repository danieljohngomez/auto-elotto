import {PcsoWebCrawler} from "../application/pcso/pcso-web-crawler";
import {GmailNotificationService} from "../application/notification/gmail-notification-service";
import {logger} from "../application/logger";
import {Config} from "../application/config";

(async () => {
    logger.info( 'Starting crawler');

    const crawlerDelay = Config.crawlerDelay();
    const delayFromMs = crawlerDelay.from_seconds * 1000;
    const delayToMs = crawlerDelay.to_seconds * 1000;
    const randomDelay = Math.floor(Math.random() * (delayToMs - delayFromMs + 1)) + delayFromMs;
    await new Promise( resolve => setTimeout(resolve, randomDelay) );

    const gmailNotificationService = new GmailNotificationService();
    const crawler = await PcsoWebCrawler.create(gmailNotificationService);
    await crawler.crawl();
    logger.info( 'Done crawling');
    process.exit(0);
})()
