<!-- PROJECT LOGO -->
<br />
<div align="center">
<h3 align="center">Auto eLotto</h3>

  <p align="center">
    Automated betting system for Philippines' eLotto (PCSO)
    <br />
    <a href="https://github.com/danieljohngomez/auto-elotto/issues/new?labels=bug">Report Bug</a>
    ·
    <a href="https://github.com/danieljohngomez/auto-elotto/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

Wouldn't it be nice to have an automated betting for Philippines' eLotto system (PCSO)? This project allows you to bet with low-effort without the hassle of logging in, selecting numbers, and paying for the bet.
You can set up the app to run everyday at a specific time to bet on your behalf. Get notified when a bet is successful and when you need to top up your balance. Soon, you'll get notified as well when you win!

The app will pick the game with the highest winning prize. Currently only 6/58 and 6/55 are supported.

> [!WARNING]  
> Please gamble responsibly. Only bet what you can afford to lose.

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/en/download) >= v20
* [PCSO eLotto account](https://elotto.pcso.gov.ph)
* Gmail account for the sender of notifications
  * [GMail app password](https://support.google.com/mail/answer/185833?hl=en)

### Installation
1. Copy `.env.example` as `.env`. Change the values accordingly. See [Environment Variables](#environment-variables) for the description of each variables. 
2. Install dependencies
   ```sh
   npm install
   ```
4. Start the crawler
   ```js
   npm run start
   ```

<!-- USAGE EXAMPLES -->
## Usage

### Environment Variables

| Env Variable                          | Description                                                                                                                              | Optional                       | Default Value                            |
|---------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------|------------------------------------------|
| MOBILE_NUMBER                         | Mobile number of your PCSO eLotto account                                                                                                | No                             |                                          |
| PIN                                   | PIN of your PCSO eLotto account                                                                                                          | No                             |                                          |
| GMAIL_NOTIFICATION_EMAIL_ADDRESS_FROM | GMail email address where the notifications are sent from                                                                                | No                             |                                          |
| GMAIL_NOTIFICATION_EMAIL_PASSWORD     | GMail app password of the email address where the notifications are sent from                                                            | No                             |                                          |
| NOTIFICATION_EMAIL_ADDRESS_RECIPIENT  | The email address where the notifications are sent to                                                                                    | No                             |                                          |
| LOW_BALANCE_THRESHOLD                 | Amount in Philippine Peso. Notification is sent when the balance reaches this amount.                                                    | Yes                            | `50`                                     |
| HEADLESS_BROWSER                      | `true` or `false`, whether the crawler should run with UI or not                                                                         | Yes                            | `false`                                  |
| MAX_BETS_PER_DAY                      | Disallows betting when the number of bets reaches this threshold per day                                                                 | Yes                            | `1`                                      |
| TICKET_TYPE                           | Possible values: `LUCKY_PICK` - random numbers will be picked. <br/><br/> `MANUAL` - numbers defined in `TICKET_NUMBERS` will be picked. | Yes                            | `LUCKY_PICK`                             |
| TICKET_NUMBERS                        | The numbers to pick when betting separated by comma. This will only take effect if `TICKET_TYPE` is `MANUAL`.                            | No if `TICKET_TYPE` = `MANUAL` |                                          |
| PCSO_BASE_URL                         | The base URL of PCSO's eLotto website                                                                                                    | Yes                            | `https://elotto.pcso.gov.ph`             |
| BROWSER_PATH                          | The file path of the web browser to use for crawling                                                                                     | Yes                            | (default browser installed by Puppeteer) |

> [!WARNING]  
> When running the app with `MANUAL` ticket type, ensure you don't have an existing bet with the same numbers to prevent a duplicate bet.


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the Apache License 2.0. See `LICENSE.txt` for more information.


<!-- CONTACT -->
## Contact

Daniel John Gomez<br/>
Email: [djgomez23+gh@gmail.com](mailto:djgomez23+gh@gmail.com) <br/>
LinkedIn: [danieljohngomez](https://www.linkedin.com/in/danieljohngomez)

