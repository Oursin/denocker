import * as base64 from "https://deno.land/x/base64/mod.ts";
import { HttpClient, HttpQuery, HttpRequest } from "./httpClient.ts";
import { RegistryAuth } from "./auth.ts";

export class DockerClient {
  socketAddress: string;
  authConfig: RegistryAuth | null;
  client: () => Promise<HttpClient>;

  constructor(socketAddress: string, authConfig: RegistryAuth | null = null) {
    this.socketAddress = socketAddress;
    this.authConfig = authConfig;
    this.client = this.init;
  }

  async init(): Promise<HttpClient> {
    const conn = await Deno.connect(
      <any> { transport: "unix", path: this.socketAddress },
    );
    return new HttpClient(conn);
  }

  async makeRequest(
    method: string,
    path: string,
    body: string,
    query: HttpQuery[],
  ) {
    const client = await this.client();
    const enc = new TextEncoder();
    const headers: {[key: string]: string} = {
      "Host": "docker",
      "Accept": "application/json",
    }
    if (this.authConfig) {
      headers["X-Registry-Auth"] = base64.fromUint8Array(enc.encode(JSON.stringify(this.authConfig)));
    }
    const request: HttpRequest = {
      method: method,
      path,
      query,
      headers,
      body,
    };
    return client.sendRequest(request);
  }

  async get(path: string, query: HttpQuery[] = []) {
    return this.makeRequest("GET", path, "", query);
  }

  async post(path: string, body: string, query: HttpQuery[] = []) {
    return this.makeRequest("POST", path, body, query);
  }

  async delete(path: string, body: string, query: HttpQuery[] = []) {
    return this.makeRequest("DELETE", path, body, query);
  }
}
