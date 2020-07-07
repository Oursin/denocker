import { HttpClient, HttpQuery, HttpRequest } from "./httpClient.ts";

export class DockerClient {
  socketAddress: string;
  client: () => Promise<HttpClient>;

  constructor(socketAddress: string) {
    this.socketAddress = socketAddress;
    this.client = this.init;
  }

  async init(): Promise<HttpClient> {
    const conn = await Deno.connect(
      <any> { transport: "unix", path: this.socketAddress },
    );
    return new HttpClient(conn);
  }

  async get(path: string, query: HttpQuery[] = []) {
    const client = await this.client();
    const request: HttpRequest = {
      method: "GET",
      path,
      query,
      headers: {
        "Host": "docker",
        "Accept": "application/json",
      },
      body: "",
    };
    return client.sendRequest(request);
  }

  async post(path: string, body: string, query: HttpQuery[] = []) {
    const client = await this.client();
    const request: HttpRequest = {
      method: "POST",
      path,
      query,
      headers: {
        "Host": "docker",
        "Accept": "application/json",
      },
      body,
    };
    return client.sendRequest(request);
  }
}
