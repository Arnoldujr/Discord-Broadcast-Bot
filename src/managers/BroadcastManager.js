const fs = require('fs');
const WorkerQueue = require('../utils/queue');
const { replyCV2, sendCV2 } = require('../utils/cv2Builder');
const logger = require('../utils/logger');
const { loadFailed, saveFailed } = require('../utils/storage');

class BroadcastManager {
    constructor(botManager) {
        this.botManager = botManager;
        this.isBroadcasting = false;
        this.stats = { total: 0, sent: 0, failed: 0, skipped: 0 };
    }

    getConfig() {
        const configPath = './src/config.json';
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    async executeBroadcast(message, content, targetIds = null) {
        if (this.isBroadcasting) return replyCV2(message, ['### System Error', 'Broadcast in progress.']);
        
        this.isBroadcasting = true;
        this.stats = { total: 0, sent: 0, failed: 0, skipped: 0 };
        const config = this.getConfig();
        const failedSet = loadFailed();

        logger.info('Gathering recipients and balancing workload across bot fleet...');
        await replyCV2(message, ['### Broadcast Initialized', 'Gathering recipients and balancing workload...']);

        let userToClientsMap = new Map();
        for (const client of this.botManager.clients) {
            for (const guild of client.guilds.cache.values()) {
                try {
                    const members = await guild.members.fetch();
                    for (const member of members.values()) {
                        if (member.user.bot) continue;
                        if (targetIds && !targetIds.has(member.user.id)) continue;

                        if (!userToClientsMap.has(member.user.id)) {
                            userToClientsMap.set(member.user.id, {
                                user: member.user,
                                eligibleClients: []
                            });
                        }
                        userToClientsMap.get(member.user.id).eligibleClients.push(client);
                    }
                } catch (e) {}
            }
        }

        const targets = [];
        const clientTaskCounts = new Map(this.botManager.clients.map(c => [c, 0]));

        for (const [userId, data] of userToClientsMap.entries()) {
            data.eligibleClients.sort((a, b) => clientTaskCounts.get(a) - clientTaskCounts.get(b));
            const bestClient = data.eligibleClients[0];

            if (bestClient) {
                clientTaskCounts.set(bestClient, clientTaskCounts.get(bestClient) + 1);
                targets.push({
                    user: data.user,
                    client: bestClient
                });
            }
        }

        this.stats.total = targets.length;

        const tasks = targets.map(target => async () => {
            try {
                const clientUserInstance = await target.client.users.fetch(target.user.id);
                await clientUserInstance.send(`${content}\n\n<@${target.user.id}>`);
                
                await new Promise(res => setTimeout(res, config.delayBetweenMessagesMs));
                this.stats.sent++;
                failedSet.delete(target.user.id);
                
                logger.debug(`[SENT] ${target.user.tag} via ${target.client.user.tag}`);
            } catch (e) {
                this.stats.failed++;
                failedSet.add(target.user.id);
                
                let errorReason = e.message || 'Unknown API Error';
                if (e.code === 50007) {
                    errorReason = "User closed DMs / Blocked Bot";
                } else if (e.code === 401 || e.code === 403) {
                    errorReason = "Bot account flagged / Token dead";
                } else if (e.code === 429) {
                    errorReason = "Rate-limited by Discord Gateway";
                }
                
                logger.debug(`\x1b[31m[FAILED]\x1b[0m ${target.user.tag} via ${target.client.user.tag} -> ${errorReason}`);
                
                if (e.code === 401 || e.code === 403) {
                    logger.error(`Token flagged/invalid for ${target.client.user.tag}. Removing.`);
                    this.botManager.clients = this.botManager.clients.filter(c => c !== target.client);
                }
            }
        });

        await WorkerQueue.process(tasks, config.concurrency, task => task());
        saveFailed(failedSet);
        this.isBroadcasting = false;

        return sendCV2(message.channel, [
            '### Broadcast Completed',
            `Sent: ${this.stats.sent}`,
            `Failed (Saved): ${this.stats.failed}`
        ]);
    }
}

module.exports = BroadcastManager;