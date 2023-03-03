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
            throw new Error("timestamp not found!");
        }

        delete this.timestamps[messageId];
        return new Date().valueOf() - startTime.valueOf();
    }
}
