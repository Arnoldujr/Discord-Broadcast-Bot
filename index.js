require('dotenv').config();
const BotManager = require('./src/managers/BotManager');
const logger = require('./src/utils/logger');

process.on('uncaughtException', error => {
    logger.error(error);
});

process.on('unhandledRejection', reason => {
    logger.error(reason);
});

const manager = new BotManager();
manager.start().catch(logger.error);