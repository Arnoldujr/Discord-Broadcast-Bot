const { replyCV2 } = require('../utils/cv2Builder');
const { loadFailed } = require('../utils/storage');

module.exports = {
    name: 'bc',
    async execute(message, args, botManager) {

        if (args[0] === 'json') {
            const failedSet = loadFailed();
            if (failedSet.size === 0) return replyCV2(message, ['### Status', 'No failed users to retry.']);
            
            const content = args.slice(1).join(' ');
            if (!content) return replyCV2(message, ['### Error', 'Please provide content for the retry.']);
            
            return await botManager.broadcastManager.executeBroadcast(message, content, failedSet);
        }

   
        if (args.length === 0) return replyCV2(message, ['### Error', 'Provide message content.']);
        await botManager.broadcastManager.executeBroadcast(message, args.join(' '));
    }
};