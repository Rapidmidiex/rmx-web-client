import { writable } from 'svelte/store';
import { PingStats, RoundtripTimer } from '@lib/ping/PingStats';

function createStats() {
    const timer = new RoundtripTimer();
    const { subscribe, set, update } = writable<PingStats>(new PingStats());

    return {
        subscribe,
        reset() {
            set(new PingStats());
        },
        msgOut(msgId: string) {
            timer.startTimer(msgId);
        },
        msgIn(msgId: string) {
            try {
                const roundtripTime = timer.stopTimer(msgId);
                update((stats) => stats.calcStats(roundtripTime));
            } catch (error) {
                // Ignore messages missing from timer dictionary.
            }
        },
    };
}

export const pingStats = createStats();
