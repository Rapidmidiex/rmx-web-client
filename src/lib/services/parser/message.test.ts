import { MessageParser } from "./message";

{
    const parser = new MessageParser("#123");
    // Testing decoding
    {
        let raw = `{...some midi message...}`;

        let parsed = parser.decode<"midi">(raw);
        parsed.payload.state;
        // @ts-expect-error
        parsed.payload.displayName; // this should only ne allowed for "text" messages  
        // @ts-expect-error
        parsed.payload.userName; // this should only be allowed for "connect" messages
    }
    // Testing encoding
    {
        let p = parser.encode("midi", {
            state: 1,
            number: 1,
            velocity: 1,
            // @ts-expect-error
            userName: "type-error", // userName does not exist on "midi" messages
        });

        // unknown type, use switch to determine
        let m = parser.decode(p);

        switch (m.type) {
            case "midi":
                m.payload.state;
                m.payload.number;
                m.payload.velocity;
                // @ts-expect-error
                m.payload.userName; // userName does not exist on "midi" messages
                break;
            case "text":
                m.payload.displayName;
                m.payload.body;
                // @ts-expect-error
                m.payload.userName; // userName does not exist on "text" messages
                break;
            case "connect":
                m.payload.userId;
                m.payload.userName;
                // @ts-expect-error
                m.payload.displayName; // displayName does not exist on "connect" messages
                break;
        }
    }
}