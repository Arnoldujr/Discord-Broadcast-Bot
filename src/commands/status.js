const { replyCV2 } = require('../utils/cv2Builder');

module.exports = {
    name: 'status',
    async execute(message, args, botManager) {
        const stats = botManager.broadcastManager.getStats();
        const isBroadcasting = botManager.broadcastManager.isBroadcasting;
        
        return replyCV2(message, [
            '### Broadcast Telemetry',
            `**Operation Active:** ${isBroadcasting ? 'Yes' : 'No'}`,
            `**Discovered Targets:** ${stats.total}`,
            `**Packets Sent:** ${stats.sent}`,
            `**Packets Failed:** ${stats.failed}`,
            `**Packets Skipped:** ${stats.skipped}`
        ]);
    }
};