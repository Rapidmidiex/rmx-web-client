import type { Envelope } from '@lib/envelope/envelope';
import type { ConnectMsg, MIDIMsg, TextMsg } from '@lib/types/jam';

// planning to move everything inside classes
class WSConn {
    conn: WebSocket;

    constructor(conn: WebSocket) {
        this.conn = conn;
    }

    sendMsg(msg: Envelope<MIDIMsg | TextMsg | ConnectMsg>) {
        this.conn.send(msg.json());
    }
}

export default WSConn;
