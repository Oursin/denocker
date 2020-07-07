import {
  assert,
    equal,
} from "https://deno.land/std/testing/asserts.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

import Docker from "../index.ts";

Deno.test("container creation", async () => {
  const container = await Docker.containers.create(v4.generate(), {
    Image: "ubuntu",
    Cmd: ["true"],
    StopTimeout: 10,
  });
  assert(typeof container.Id === "string");
});

Deno.test("container start", async () => {
  const container = await Docker.containers.create(v4.generate(), {
    Image: "ubuntu",
    Cmd: ["true"],
    StopTimeout: 10,
  });
  assert(typeof container.Id === "string");
  await Docker.containers.start(container.Id);
})

Deno.test("container list", async () => {
  const container = await Docker.containers.create(v4.generate(), {
    Image: "ubuntu",
    Cmd: ["true"],
    StopTimeout: 10,
  });
  assert(typeof container.Id === "string");
  await Docker.containers.start(container.Id);
  const containerList = await Docker.containers.list();
  equal(container.Id, containerList[0].Id);
})