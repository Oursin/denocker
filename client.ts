import { DockerClient } from "./client/client.ts";

export default new DockerClient("/var/run/docker.sock");
