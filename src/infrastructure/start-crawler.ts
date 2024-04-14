import {PcsoWebCrawler} from "../application/pcso/pcso-web-crawler";
import {GmailNotificationService} from "../application/notification/gmail-notification-service";
import {logger} from "../application/logger";

(async () => {
    logger.info( 'Starting crawler');
    const gmailNotificationService = new GmailNotificationService();
    const crawler = await PcsoWebCrawler.create(gmailNotificationService);
    await crawler.crawl();
    logger.info( 'Done crawling');
    process.exit(0);
})()
