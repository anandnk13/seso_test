"use strict";

const PriorityQueue = require('js-priority-queue');

module.exports = (logSources, printer) => {
  // Create a priority queue that sorts log entries by date
  const pq = new PriorityQueue({ comparator: (a, b) => a.logEntry.date - b.logEntry.date });

  // Add the first log entry from each log source to the queue
  logSources.forEach((logSource, index) => {
    const logEntry = logSource.pop();
    if (logEntry) pq.queue({ logEntry, index });
  });

  // Process the queue until all log entries have been printed
  while (pq.length > 0) {
    const { logEntry, index } = pq.dequeue();
    printer.print(logEntry);

    // Get the next log entry from the same source and add it to the queue
    const nextEntry = logSources[index].pop();
    if (nextEntry) pq.queue({ logEntry: nextEntry, index });
  }

  printer.done();
};