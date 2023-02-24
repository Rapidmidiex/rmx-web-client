export class RoundTripTimer {
    private timestamps: Record<string, Date>;

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

        delete this.timestamps[messageId];
        return new Date().valueOf() - startTime.valueOf();
    }
}

export class PingStats {
    totalMsgs: number;
    // milliseconds
    avg: number;
    latest: number;
    min: number;
    max: number;

    constructor(init?: Omit<PingStats, 'calcStats'>) {
        if (!init) {
            this.avg = 0;
            this.min = Infinity;
            this.max = -Infinity;
            this.totalMsgs = 0;
            this.latest = 0;
        } else {
            this.avg = init.avg;
            this.min = init.min;
            this.max = init.max;
            this.totalMsgs = init.totalMsgs;
            this.latest = init.latest;
        }
    }

    /**
     * Calculates ping statistics with the given millisecond duration and returns a new instance. The original instance is left unchanged.
     */
    calcStats(latest: number): PingStats {
        // https://stackoverflow.com/questions/22999487/update-the-average-of-a-continuous-sequence-of-numbers-in-constant-time
        const avg = (this.totalMsgs * this.avg + latest) / (this.totalMsgs + 1);
        return new PingStats({
            totalMsgs: this.totalMsgs + 1,
            min: Math.min(this.min, latest),
            max: Math.max(this.max, latest),
            avg,
            latest,
        });
    }
}
