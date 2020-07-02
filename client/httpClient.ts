export class HttpClient {
    buf: Uint8Array;
    res: string;
    conn: Deno.Conn;

    constructor(conn: Deno.Conn) {
        this.conn = conn;
        this.buf = new Uint8Array(1);
        this.res = "";
    }

    async readLine() {
        const dec = new TextDecoder();
        this.res = "";
        this.buf = new Uint8Array(1);

        while (true) {
            if (this.res.indexOf('\n') !== -1) {
                return this.res.slice(0, this.res.length - 2);
            }
            await this.conn.read(this.buf);
            this.res += dec.decode(this.buf);
        }
    }

    async read(buf: Uint8Array) {
        return this.conn.read(buf);
    }

    async send(data: string) {
        const enc = new TextEncoder();

        return this.conn.write(enc.encode(data));
    }

}