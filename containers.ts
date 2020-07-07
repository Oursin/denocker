import client from "./client.ts";
import {
  ListContainer,
  ContainerCreate,
  ContainerCreateResponse,
} from "./types.ts";

async function list(): Promise<ListContainer[]> {
  const res = await client.get("/containers/json");
  if (!res.body || !res.body.length) {
    return [];
  }
  return JSON.parse(res.body);
}

async function create(
  name: string,
  config: ContainerCreate,
): Promise<ContainerCreateResponse> {
  const res = await client.post(
    "/containers/create",
    JSON.stringify(config),
    [{ name: "name", value: name }],
  );
  if (!res.body || !res.body.length) {
    return {};
  }
  return JSON.parse(res.body);
}

async function start(id: string) {
  const res = await client.post(`/containers/${id}/start`, "");
  if (!res.body || !res.body.length) {
    return {};
  }
  return JSON.parse(res.body);
}

async function stop(id: string) {
  const res = await client.post(`/containers/${id}/stop`, "");
  if (!res.body || !res.body.length) {
    return {};
  }
  return JSON.parse(res.body);
}

export {
  list,
  create,
  start,
  stop,
};
