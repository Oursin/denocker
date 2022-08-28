import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.150.0/testing/asserts.ts";

import Docker from "../index.ts";
import { retry } from "./helpers.ts";

const docker = new Docker("/var/run/docker.sock");

Deno.test("container creation", async () => {
  const container = await docker.containers.create(crypto.randomUUID(), {
    Image: "ubuntu",
    Cmd: ["true"],
    StopTimeout: 10,
  });
  assert(typeof container.Id === "string");
});

Deno.test("container start", async () => {
  const container = await docker.containers.create(crypto.randomUUID(), {
    Image: "ubuntu",
    Cmd: ["true"],
    StopTimeout: 10,
  });
  assert(typeof container.Id === "string");
  await docker.containers.start(container.Id);
});

Deno.test("container list", async () => {
  const container = await docker.containers.create(crypto.randomUUID(), {
    Image: "ubuntu",
    Cmd: ["true"],
    StopTimeout: 10,
  });
  assert(typeof container.Id === "string");
  await docker.containers.start(container.Id);
  const containerList = await docker.containers.list();
  assertEquals(container.Id, containerList[0].Id);
});

Deno.test("container list with labels", async () => {
  await docker.containers.create(crypto.randomUUID(), {
    Image: "ubuntu",
    Cmd: ["true"],
    Labels: {"label1": "value1"}
  })
  await docker.containers.create(crypto.randomUUID(), {
    Image: "ubuntu",
    Cmd: ["true"],
    Labels: {"label2": "value2"}
  })
  const containers = await docker.containers.list({all: true})
  console.log(containers)
  const filteredContainers = containers.filter(c => c.Labels?.["label1"] == "value1")
  console.log(filteredContainers)
  assertEquals(filteredContainers.length, 1)
})

Deno.test("container stop", async () => {
  const { Id: id } = await docker.containers.create(crypto.randomUUID(), {
    Image: "ubuntu",
    Cmd: ["sleep", "500"],
    StopTimeout: 10,
  });
  assert(typeof id === "string");
  await docker.containers.start(id);
  const containerList = await docker.containers.list();
  assertEquals(id, containerList[0].Id);
  await docker.containers.stop(id);
  await retry(
    async () => {
      const containerList = await docker.containers.list();
      return (containerList.length == 0);
    },
    10,
    2000
  )
});

Deno.test("container wait", async () => {
  const { Id: id } = await docker.containers.create(crypto.randomUUID(), {
    Image: "ubuntu",
    Cmd: ["sleep 0.1"],
    StopTimeout: 10,
  });
  assert(typeof id === "string");
  await docker.containers.start(id);
  await docker.containers.wait(id);
});

Deno.test("container kill", async () => {
  const { Id: id } = await docker.containers.create(crypto.randomUUID(), {
    Image: "ubuntu",
    Cmd: ["true"],
    StopTimeout: 10,
  });
  assert(typeof id === "string");
  await docker.containers.start(id);
  const containerList = await docker.containers.list();
  assertEquals(id, containerList[0].Id);
  await docker.containers.kill(id);
});

Deno.test("container rm", async () => {
  const { Id: id } = await docker.containers.create(crypto.randomUUID(), {
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
  containerList = await docker.containers.list({
    filters: `{"id":["${ id }"]}`,
    all: true
  });
  assertEquals(containerList.length, 0);
});

Deno.test("container inspect", async () => {
  const { Id: id } = await docker.containers.create(crypto.randomUUID(), {
    Image: "ubuntu",
    Cmd: ["true"],
    StopTimeout: 10,
  });
  assert(typeof id === "string");
  const containerData = await docker.containers.inspect(id);
  assert(containerData.Path === "true")
  assert(containerData.State?.Status === "created")
  assert(typeof containerData.GraphDriver?.Name === "string")
})
