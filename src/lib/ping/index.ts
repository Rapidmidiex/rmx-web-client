import { writable } from "svelte/store";
import { PingStats } from "./pingStats";
import { RoundTripTimer } from "./roundTripTimer";

function createStats() {
    const timer = new RoundTripTimer();
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
                const roundTripTime = timer.stopTimer(msgId);
                update((stats) => stats.calcStats(roundTripTime));
            } catch (error) {
                // Ignore messages missing from timer dictionary.
            }
        },
    };
}

export const pingStats = createStats();
