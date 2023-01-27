import { Ping, type PingStats } from './PingStats';
import { describe, expect, it } from 'vitest';

describe('PingStats', () => {
    it('should set timestamps', async () => {
        const ping = new Ping();
        const msgId = 'abc';

        ping.startTimer(msgId);
        await wait(20);
        const elapsed = ping.stopTimer(msgId);

        expect(elapsed).greaterThan(0);
    });

    it('should calculate new stats based on existing stats', () => {
        const durations = [19, 1000, 129, 34, 36, 49, 234];

        const initial: PingStats = {
            avg: 0,
            min: Infinity,
            max: -Infinity,
            totalMsgs: 0,
            latest: 0,
        };

        const actual = durations.reduce(
            (stats, d) => Ping.calcStats(stats, d),
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
