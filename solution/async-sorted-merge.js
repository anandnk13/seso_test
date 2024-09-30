"use strict";

const PriorityQueue = require('js-priority-queue');

module.exports = async (logSources, printer) => {
    const pq = new PriorityQueue({ comparator: (a, b) => a.logEntry.date - b.logEntry.date });
    const activeSources = new Set();  // Track active sources in the queue

    // Helper function to fetch the next log from a specific source
    const fetchNextLog = async (source, sourceIndex) => {
        const nextLogEntry = await source.popAsync();
        if (nextLogEntry) {
            pq.queue({ logEntry: nextLogEntry, sourceIndex });
        } else {
            activeSources.delete(sourceIndex);  // Remove source if drained
        }
    };

    // Initialize the queue with the first log entry from each log source
    await Promise.all(
        logSources.map(async (source, index) => {
            const logEntry = await source.popAsync();
            if (logEntry) {
                pq.queue({ logEntry, sourceIndex: index });
                activeSources.add(index);  // Mark source as active
            }
        })
    );

    // Process the queue and print log entries in order
    while (pq.length) {
        const { logEntry, sourceIndex } = pq.dequeue();
        printer.print(logEntry);

        // Get the next logs in parallel for all the active source
        if (activeSources.has(sourceIndex)) {
            await fetchNextLog(logSources[sourceIndex], sourceIndex);
        }

        // Fetch logs concurrently from all active sources
        const promises = Array.from(activeSources).map((index) => fetchNextLog(logSources[index], index));
        await Promise.all(promises);
    }

  printer.done();
};
