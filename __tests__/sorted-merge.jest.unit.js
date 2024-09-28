const LogSource = require("../lib/log-source");
const Printer = require("../lib/printer");
const syncSortedMerge = require("../solution/sync-sorted-merge");
const asyncSortedMerge = require("../solution/async-sorted-merge");

describe("Sync and Async Merge Tests", () => {

    test("Sync Merge: It should correctly merge log sources", () => {
        const logSources = [new LogSource(), new LogSource(), new LogSource()];
        const printer = new Printer();

        // Spy on the printer's print method to verify printed entries
        const printSpy = jest.spyOn(printer, 'print');
        const printDone = jest.spyOn(printer, 'done');

        // Run the sync merge
        syncSortedMerge(logSources, printer);

        // Check that the printer printed entries in sorted order
        expect(printSpy).toHaveBeenCalled();
        const printedEntries = printSpy.mock.calls.map(call => call[0]);
        for (let i = 1; i < printedEntries.length; i++) {
            expect(printedEntries[i].date >= printedEntries[i - 1].date).toBeTruthy();
        }

        // Verify the `done` method is called at the end
        expect(printDone).toHaveBeenCalled();
    });

    test("Async Merge: It should correctly merge log sources asynchronously", async () => {
        const logSources = [new LogSource(), new LogSource(), new LogSource()];
        const printer = new Printer();

        // Spy on the printer's print method to verify printed entries
        const printSpy = jest.spyOn(printer, 'print');
        const printDone = jest.spyOn(printer, 'done');
        // Run the async merge
        await asyncSortedMerge(logSources, printer);

        // Check that the printer printed entries in sorted order
        expect(printSpy).toHaveBeenCalled();
        const printedEntries = printSpy.mock.calls.map(call => call[0]);
        for (let i = 1; i < printedEntries.length; i++) {
            expect(printedEntries[i].date >= printedEntries[i - 1].date).toBeTruthy();
        }

        // Verify the `done` method is called at the end
        expect(printDone).toHaveBeenCalled();
    });

    test("Sync Merge: It should handle empty log sources", () => {
        const logSources = []; // No log sources
        const printer = new Printer();

        const printSpy = jest.spyOn(printer, 'print');
        const printDone = jest.spyOn(printer, 'done');
        syncSortedMerge(logSources, printer);

        expect(printSpy).not.toHaveBeenCalled(); // No logs printed
        expect(printDone).toHaveBeenCalled();
    });

    test("Async Merge: It should handle empty log sources", async () => {
        const logSources = []; // No log sources
        const printer = new Printer();

        const printSpy = jest.spyOn(printer, 'print');
        const printDone = jest.spyOn(printer, 'done');
        await asyncSortedMerge(logSources, printer);

        expect(printSpy).not.toHaveBeenCalled(); // No logs printed
        expect(printDone).toHaveBeenCalled();
    });

});