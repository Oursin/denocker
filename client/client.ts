import { HttpClient } from './httpClient.ts'

interface Query {
    name: string
    value: string
}

interface HttpHeader {
    [key: string]: string
}

interface HttpResponse {
    status?: number
    headers?: HttpHeader
    body?: string
}

export class DockerClient {
    socketAddress: string;
    client: Promise<HttpClient>;

    constructor(socketAddress: string) {
        this.socketAddress = socketAddress;
        this.client = this.init();
    }

    async init(): Promise<HttpClient> {
        const conn = await Deno.connect(<any>{ transport: "unix", path: this.socketAddress })
        return new HttpClient(conn);
    }

    async readHead(res: HttpResponse, client: HttpClient) {
        const line = await client.readLine();
        res.status = parseInt(line.split(' ')[1]);
    }

    async readHeaders(res: HttpResponse, client: HttpClient) {
        let isEnd = false;

        res.headers = {};
        while (!isEnd) {
            const line = await client.readLine();
            if (line === "") {
                isEnd = true;
            } else {
                const [name, value] = line.split(':');
                res.headers[name.trim()] = value.trim();            }
        }
    }

    async readBody(res: HttpResponse, client: HttpClient) {
        const dec = new TextDecoder();
        let finished = false;
        let body = "";
        const headers = res!.headers;

        if (headers!["Transfer-Encoding"] === "chunked") {
            while (!finished) {
                const bufsize = parseInt(await client.readLine(), 16);
                if (bufsize === 0) {
                    finished = true;
                } else {
                    const buf = new ArrayBuffer(bufsize);
                    const arr = new Uint8Array(buf);
                    await client.read(arr);
                    body += dec.decode(arr);
                    await client.readLine();
                }
            }
        } else {
            const bufsize = parseInt(res?.headers!["Content-Length"], 10);
            const buf = new ArrayBuffer(bufsize);
            const arr = new Uint8Array(buf);
            await client.read(arr);
            body += dec.decode(arr);
        }
        res.body = body;
    }

    buildQueryString(query: Query[]) {
        return query.map((v) => `${v.name}=${v.value}`).join('&');
    }

    async get(path: string, query: Query[] = []) {
        const client = await this.client;
        const response: HttpResponse = {};
        const req = `GET ${path}?${this.buildQueryString(query)} HTTP/1.1\r\nHost: docker\r\nAccept: application/json\r\nAccept-encoding: chunked\r\n\r\n`
        console.log(req);
        await client.send(req);
        await this.readHead(response, client);
        await this.readHeaders(response, client);
        await this.readBody(response, client);
        await client.conn.close();
        return response;
    }

    async post(path: string, body: string, query: Query[] = []) {

    }
}
