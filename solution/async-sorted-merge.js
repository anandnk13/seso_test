"use strict";

const PriorityQueue = require('js-priority-queue');

module.exports = async (logSources, printer) => {
  const pq = new PriorityQueue({ comparator: (a, b) => a.logEntry.date - b.logEntry.date });

  // Initialize the queue with the first log entry from each log source
  await Promise.all(
      logSources.map(async (source, index) => {
        const logEntry = await source.popAsync();
        if (logEntry) pq.queue({ logEntry, sourceIndex: index });
      })
  );

  // Process the queue and print log entries in order
  while (pq.length) {
    const { logEntry, sourceIndex } = pq.dequeue();
    printer.print(logEntry);

    // Get the next log entry from the same source
    const nextLogEntry = await logSources[sourceIndex].popAsync();
    if (nextLogEntry) pq.queue({ logEntry: nextLogEntry, sourceIndex });
  }

  printer.done();
};
