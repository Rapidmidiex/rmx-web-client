import { MessageParser } from './message';

{
    const parser = new MessageParser('a-user-id');
    // Testing decoding
    {
        const raw = `{...some midi message...}`;

        const parsed = parser.decode<'midi'>(raw);
        parsed.payload.state;
        // @ts-expect-error: Only allowed for "text" messages
        parsed.payload.displayName;
        // @ts-expect-error: Only allowed for "connect" messages
        parsed.payload.userName;
    }
    // Testing encoding
    {
        const p = parser.encode('midi', {
            state: 1,
            number: 1,
            velocity: 1,
            // @ts-expect-error: userName does not exist on "midi" messages
            userName: 'type-error',
        });

        // unknown type, use switch to determine
        const m = parser.decode(p);

        switch (m.type) {
            case 'midi':
                m.payload.state;
                m.payload.number;
                m.payload.velocity;
                // @ts-expect-error: userName does not exist on "midi" messages
                m.payload.userName;
                break;
            case 'text':
                m.payload.displayName;
                m.payload.body;
                // @ts-expect-error: userName does not exist on "text" messages
                m.payload.userName;
                break;
            case 'connect':
                m.payload.userId;
                m.payload.userName;
                // @ts-expect-error: displayName does not exist on "connect" messages
                m.payload.displayName;
                break;
        }
    }
}
