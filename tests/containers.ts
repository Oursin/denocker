import {
  assert,
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

import Docker from "../index.ts";
import {sleep} from "./helpers.ts";

const docker = new Docker("/var/run/docker.sock");

Deno.test("container creation", async () => {
  const container = await docker.containers.create(v4.generate(), {
    Image: "ubuntu",
    Cmd: ["true"],
    StopTimeout: 10,
  });
  assert(typeof container.Id === "string");
});

Deno.test("container start", async () => {
  const container = await docker.containers.create(v4.generate(), {
    Image: "ubuntu",
    Cmd: ["true"],
    StopTimeout: 10,
  });
  assert(typeof container.Id === "string");
  await docker.containers.start(container.Id);
});

Deno.test("container list", async () => {
  const container = await docker.containers.create(v4.generate(), {
    Image: "ubuntu",
    Cmd: ["true"],
    StopTimeout: 10,
  });
  assert(typeof container.Id === "string");
  await docker.containers.start(container.Id);
  const containerList = await docker.containers.list();
  assertEquals(container.Id, containerList[0].Id);
});

Deno.test("container stop", async () => {
  const { Id: id } = await docker.containers.create(v4.generate(), {
    Image: "ubuntu",
    Cmd: ["true"],
    StopTimeout: 10,
  });
  assert(typeof id === "string");
  await docker.containers.start(id);
  let containerList = await docker.containers.list();
  assertEquals(id, containerList[0].Id);
  await docker.containers.stop(id);
  containerList = await docker.containers.list();
  assertEquals(containerList.length, 0);
});

Deno.test("container wait", async () => {
  const { Id: id } = await docker.containers.create(v4.generate(), {
    Image: "ubuntu",
    Cmd: ["sleep 0.1"],
    StopTimeout: 10,
  });
  assert(typeof id === "string");
  await docker.containers.start(id);
  await docker.containers.wait(id);
});

Deno.test("container kill", async () => {
  const { Id: id } = await docker.containers.create(v4.generate(), {
    Image: "ubuntu",
    Cmd: ["true"],
    StopTimeout: 10,
  });
  assert(typeof id === "string");
  await docker.containers.start(id);
  let containerList = await docker.containers.list();
  assertEquals(id, containerList[0].Id);
  await docker.containers.kill(id);
});

Deno.test("container rm", async () => {
  const { Id: id } = await docker.containers.create(v4.generate(), {
    Image: "ubuntu",
    Cmd: ["true"],
    StopTimeout: 10,
  });
  assert(typeof id === "string");
  await docker.containers.start(id);
  let containerList = await docker.containers.list();
  assertEquals(id, containerList[0].Id);
  await docker.containers.stop(id);
  await docker.containers.rm(id);
  containerList = await docker.containers.list({filters: `{"id":["${id}"]}`, all: true});
  assertEquals(containerList.length, 0);
});