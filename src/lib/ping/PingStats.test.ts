import { RoundtripTimer, PingStats } from './PingStats';
import { describe, expect, it } from 'vitest';

describe('RoundtripTimer', () => {
    it('should time messages', async () => {
        const rtt = new RoundtripTimer();
        const msgId = 'abc';

        rtt.startTimer(msgId);
        await wait(20);
        const elapsed = rtt.stopTimer(msgId);

        expect(elapsed).greaterThan(0);
    });

    it('startTimer() should throw if a timer has already started for a message', () => {
        const rtt = new RoundtripTimer();
        const msgId = 'abc';

        rtt.startTimer(msgId);
        expect(() => {
            rtt.startTimer(msgId);
        }).toThrowError(`timer already exists with ID: ${msgId}`);
    });

    it('stopTimer() should throw if the timer was not started for a given message', () => {
        const rtt = new RoundtripTimer();

        expect(() => {
            rtt.stopTimer('msgId');
        }).toThrowError(`timestamp not found!`);
    });

    it('should reset if a timer has been stopped for a message', async () => {
        const rtt = new RoundtripTimer();
        const msgId = 'abc';

        rtt.startTimer(msgId);
        await wait(40);
        rtt.stopTimer(msgId);

        // If an error is thrown, test will fail
        rtt.startTimer(msgId);
    });
});

describe('PingStats', () => {
    it('should calculate new stats based on existing stats', () => {
        const durations = [19, 1000, 129, 34, 36, 49, 234];

        const initial = new PingStats();

        const actual = durations.reduce(
            (stats, d) => PingStats.calcStats(stats, d),
            initial
        );

        const expected: PingStats = {
            avg: 214.42857142857142,
            min: 19,
            max: 1000,
            totalMsgs: 7,
            latest: 234,
        };

        expect(actual).toEqual(expected);
    });
});

const wait = (timeout: number) =>
    new Promise((r) => {
        setTimeout(r, timeout);
    });
