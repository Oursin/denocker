import { RegistryAuth } from "./client/auth.ts";
import { Container } from "./container.ts";
import { DockerClient } from "./client/client.ts";

export default class Docker {
  containers: Container;

  constructor(options: string|Deno.ConnectOptions, auth: RegistryAuth | null = null) {
    const client = new DockerClient(options, auth);
    this.containers = new Container(client);
  }
}
