import pino from "pino";

export const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            translateTime: "SYS:mm-dd-yyyy HH:MM:ss TT",
            colorize: true
        }
    }
});
