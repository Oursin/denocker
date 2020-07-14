import { RegistryAuth } from "./client/auth.ts";
import { Container } from "./container.ts";
import { DockerClient } from "./client/client.ts";

export default class Docker {
  containers: Container;

  constructor(socketAddress: string, auth: RegistryAuth | null = null) {
    const client = new DockerClient(socketAddress, auth);
    this.containers = new Container(client);
  }
}
