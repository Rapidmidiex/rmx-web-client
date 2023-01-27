export class Ping {
    private timestamps: Record<string, Date>;

    static calcStats(prev: PingStats, latest: number): PingStats {
        // https://stackoverflow.com/questions/22999487/update-the-average-of-a-continuous-sequence-of-numbers-in-constant-time
        const avg = (prev.totalMsgs * prev.avg + latest) / (prev.totalMsgs + 1);
        return {
            totalMsgs: prev.totalMsgs + 1,
            min: Math.min(prev.min, latest),
            max: Math.max(prev.max, latest),
            avg,
            latest,
        };
    }

    constructor() {
        this.timestamps = {};
    }

    startTimer(messageId: string) {
        if (this.timestamps[messageId]) {
            throw new Error(`timer already exists with ID: ${messageId}`);
        }
        this.timestamps[messageId] = new Date();
    }

    stopTimer(messageId: string): number {
        const startTime = this.timestamps[messageId];
        if (!startTime) {
            throw new Error('timestamp not found!');
        }
        return new Date().valueOf() - startTime.valueOf();
    }
}

export type PingStats = {
    totalMsgs: number;
    // Integer milliseconds
    avg: number;
    latest: number;
    min: number;
    max: number;
};
