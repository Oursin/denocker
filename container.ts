import {
  ListContainerResponse,
  ContainerCreate,
  ContainerCreateResponse, InspectResponse,
} from "./lib/types/container/mod.ts";
import { DockerClient } from "./lib/client/client.ts";

interface ListOptions {
  // Return all containers. By default, only running containers are shown
  all?: boolean;
  // Return this number of most recently created containers, including non-running ones.
  limit?: number;
  // Return the size of container as fields SizeRw and SizeRootFs.
  size?: number;
  // Filters to process on the container list, encoded as JSON (a map[string][]string). For example, {"status": ["paused"]} will only return paused containers.
  filters?: string;
}

export class Container {
  private client: DockerClient;

  constructor(client: DockerClient) {
    this.client = client;
  }

  async list(options?: ListOptions): Promise<ListContainerResponse[]> {
    const res = await this.client.get("/containers/json", [
      {name: "all", value: options?.all ? "true" : ""},
      {name: "limit", value: options?.limit ? options.limit.toString() : ""},
      {name: "size", value: options?.size ? options.size.toString() : ""},
      {name: "filters", value: options?.filters ?? ""},
    ]);
    if (!res.body || !res.body.length) {
      return [];
    }
    return JSON.parse(res.body);
  }

  async create(
    name: string,
    config: ContainerCreate,
  ): Promise<ContainerCreateResponse> {
    const res = await this.client.post(
      "/containers/create",
      JSON.stringify(config),
      [{ name: "name", value: name }],
    );
    if (!res.body || !res.body.length) {
      return {};
    }
    return JSON.parse(res.body);
  }

  async start(id: string) {
    const res = await this.client.post(`/containers/${id}/start`, "");
    if (!res.body || !res.body.length) {
      return {};
    }
    return JSON.parse(res.body);
  }

  async stop(id: string, timeout = 10) {
    const res = await this.client.post(
      `/containers/${id}/stop`,
      "",
      [{ name: "t", value: timeout.toString() }],
    );
    if (!res.body || !res.body.length) {
      return {};
    }
    return JSON.parse(res.body);
  }

  async restart(id: string, timeout = 10) {
    const res = await this.client.post(
      `/containers/${id}/restart`,
      "",
      [{ name: "t", value: timeout.toString() }],
    );
    if (!res.body || !res.body.length) {
      return {};
    }
    return JSON.parse(res.body);
  }

  async kill(id: string, signal = "SIGKILL") {
    const res = await this.client.post(
      `/containers/${id}/restart`,
      "",
      [{ name: "signal", value: signal }],
    );
    if (!res.body || !res.body.length) {
      return {};
    }
    return JSON.parse(res.body);
  }

  async wait(id: string, condition = "not-running") {
    const res = await this.client.post(
      `/containers/${id}/wait`,
      "",
      [{ name: "condition", value: condition }],
    );
    if (!res.body || !res.body.length) {
      return {};
    }
    return JSON.parse(res.body);
  }

  async rm(id: string, condition = "not-running") {
    const res = await this.client.delete(
      `/containers/${id}`,
      "",
      [{ name: "condition", value: condition }],
    );
    if (!res.body || !res.body.length) {
      return {};
    }
    return JSON.parse(res.body);
  }

  async inspect(id: string, size = false): Promise<InspectResponse> {
    const res = await this.client.get(
      `/containers/${id}/json`,
      [{name: "size", value: (Boolean(size)).toString()}]
    );
    if (!res.body) {
      return {};
    }
    return JSON.parse(res.body)
  }
}
