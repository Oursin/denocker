import * as base64 from "https://deno.land/x/base64@v0.2.1/mod.ts";
import { HttpClient, HttpQuery, HttpRequest, HttpResponse } from "./httpClient.ts";
import { RegistryAuth } from "./auth.ts";

export class DockerClient {
  options: Deno.ConnectOptions|Deno.UnixConnectOptions;
  authConfig: RegistryAuth | null;
  client: () => Promise<HttpClient>;

  constructor(options: string|Deno.ConnectOptions, authConfig: RegistryAuth | null = null) {
    if(typeof options == "string"){
      this.options = {
        transport: "unix",
        path: options
      }
    } else {
      this.options = options;
    }
    this.authConfig = authConfig;
    this.client = this.init;
  }

  async init(): Promise<HttpClient> {
    let conn: Deno.Conn;
    if ("path" in this.options) {
      conn = await Deno.connect(
        this.options as Deno.UnixConnectOptions
      );
    } else {
      conn = await Deno.connect(
        this.options as Deno.ConnectOptions
      )
    }
    return new HttpClient(conn);
  }

  async makeRequest(
    method: string,
    path: string,
    body: string,
    query: HttpQuery[],
  ): Promise<HttpResponse> {
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

  get(path: string, query: HttpQuery[] = []): Promise<HttpResponse> {
    return this.makeRequest("GET", path, "", query);
  }

  post(path: string, body: string, query: HttpQuery[] = []): Promise<HttpResponse> {
    return this.makeRequest("POST", path, body, query);
  }

  delete(path: string, body: string, query: HttpQuery[] = []): Promise<HttpResponse> {
    return this.makeRequest("DELETE", path, body, query);
  }
}
