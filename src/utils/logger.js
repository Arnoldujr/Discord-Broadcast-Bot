class Logger {
    // Neon Green [CONNECTED]
    static info(msg) {
        console.log(`\x1b[32m[CONNECTED]\x1b[0m \x1b[97m${msg}\x1b[0m`);
    }

    // Neon Cyan [DEBUG]
    static debug(msg) {
        console.log(`\x1b[36m[DEBUG]\x1b[0m \x1b[97m${msg}\x1b[0m`);
    }

    // Red [ERROR]
    static error(msg) {
        console.error(`\x1b[31m[ERROR]\x1b[0m \x1b[97m${msg}\x1b[0m`);
    }
}

module.exports = Logger;