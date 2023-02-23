import type { Envelope } from '@lib/envelope/envelope';
import type { ConnectMsg, MIDIMsg, TextMsg } from '@lib/types/jam';

// TODO -- this is not being used so can can be removed
class WSConn {
    private conn: WebSocket;

    constructor(conn: WebSocket) {
        this.conn = conn;
    }

    sendMsg(msg: Envelope<MIDIMsg | TextMsg | ConnectMsg>) {
        this.conn.send(msg.json());
    }
}

export default WSConn;
