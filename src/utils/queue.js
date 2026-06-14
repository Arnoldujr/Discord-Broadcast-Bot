class WorkerQueue {
    static async process(items, concurrency, asyncFn) {
        const results = [];
        const executing = [];

        for (const item of items) {
            const p = asyncFn(item).then(result => {
                executing.splice(executing.indexOf(p), 1);
                return result;
            });
            
            executing.push(p);
            results.push(p);
            
            if (executing.length >= concurrency) {
                await Promise.race(executing);
            }
        }
        
        return Promise.all(results);
    }
}

module.exports = WorkerQueue;