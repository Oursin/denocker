export interface HttpQuery {
  name: string;
  value: string;
}

export interface HttpHeader {
  [key: string]: string;
}

export interface HttpResponse {
  status?: number;
  headers?: HttpHeader;
  body?: string;
}

export interface HttpRequest {
  method: string;
  path: string;
  query: HttpQuery[];
  headers: HttpHeader;
  body: string;
}

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
      if (this.res.indexOf("\n") !== -1) {
        return this.res.slice(0, this.res.length - 2);
      }
      await this.conn.read(this.buf);
      this.res += dec.decode(this.buf);
    }
  }

  async readHead(res: HttpResponse) {
    const line = await this.readLine();
    res.status = parseInt(line.split(" ")[1]);
  }

  async readHeaders(res: HttpResponse) {
    let isEnd = false;

    res.headers = {};
    while (!isEnd) {
      const line = await this.readLine();
      if (line === "") {
        isEnd = true;
      } else {
        const [name, value] = line.split(":");
        res.headers[name.trim()] = value.trim();
      }
    }
  }

  async readBody(res: HttpResponse) {
    const dec = new TextDecoder();
    let finished = false;
    let body = "";
    const headers = res!.headers;

    if (headers!["Transfer-Encoding"] === "chunked") {
      while (!finished) {
        const bufsize = parseInt(await this.readLine(), 16);
        if (bufsize === 0) {
          finished = true;
        } else {
          const buf = new ArrayBuffer(bufsize);
          const arr = new Uint8Array(buf);
          await this.read(arr);
          body += dec.decode(arr);
          await this.readLine();
        }
      }
    } else {
      const bufsize = parseInt(res?.headers!["Content-Length"], 10);
      const buf = new ArrayBuffer(bufsize);
      const arr = new Uint8Array(buf);
      await this.read(arr);
      body += dec.decode(arr);
    }
    res.body = body;
  }

  async read(buf: Uint8Array) {
    return this.conn.read(buf);
  }

  async send(data: string) {
    const enc = new TextEncoder();

    return this.conn.write(enc.encode(data));
  }

  buildQueryString(query: HttpQuery[]) {
    return query.map((v) => `${v.name}=${v.value}`).join("&");
  }

  buildHeaders(headers: HttpHeader) {
    return Object.keys(headers).map((v) => `${v}: ${headers[v]}`).join("\r\n");
  }

  async sendRequest(request: HttpRequest) {
    const head = `${request.method} ${request.path}?${
      this.buildQueryString(request.query)
    } HTTP/1.0\r\n`;
    request.headers["Content-length"] = request.body.length.toString();
    request.headers["Content-type"] = "application/json";
    const headers = this.buildHeaders(request.headers);
    const reqString = head + headers + "\r\n\r\n" + request.body;
    await this.send(reqString);
    const response: HttpResponse = {};
    await this.readHead(response);
    await this.readHeaders(response);
    await this.readBody(response);
    await this.conn.close();
    return response;
  }
}
