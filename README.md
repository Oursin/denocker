# Denocker

A fully typed, async-first docker client library for [Deno](https://deno.land).

## Installation

```ts
import Docker from "https://deno.land/x/denocker/index.ts"
```

## Usage

### Simple example

```ts
import Docker from "https://deno.land/x/denocker/index.ts"

const docker = new Docker("/var/run/docker.sock");
const container = await docker.containers.create("my_container", {
  Image: "alpine",
  Cmd: ["ls"],
  StopTimeout: 10,
});
await docker.containers.start(container.Id);
```

### Manipulating containers

```ts
// Fetch the list of currently running containers
const containers = await docker.containers.list({all: true});

// Create a container
const container = await docker.containers.create("my_container", {
  Image: "alpine",
  Cmd: ["echo", "hello"],
});

// Start the container
await docker.containers.start(container.Id);

// Stop a container
await docker.containers.stop(container.Id);

// Kill a container
await docker.containers.kill(container.Id, "SIGKILL");

// Restart a container
await docker.containers.restart(container.Id);

// Wait until the container has finished running
await docker.container.wait(container.Id);

// Delete a container
await docker.containers.rm(container.Id);
```

## API reference

### Containers

* `containers.list` - [Docker API](https://docs.docker.com/engine/api/v1.40/#operation/ContainerList)
* `containers.create` - [Docker API](https://docs.docker.com/engine/api/v1.40/#operation/ContainerCreate)
* `containers.start` - [Docker API](https://docs.docker.com/engine/api/v1.40/#operation/ContainerStart)
* `containers.stop` - [Docker API](https://docs.docker.com/engine/api/v1.40/#operation/ContainerStop)
* `containers.kill` - [Docker API](https://docs.docker.com/engine/api/v1.40/#operation/ContainerKill)
* `containers.restart` - [Docker API](https://docs.docker.com/engine/api/v1.40/#operation/ContainerRestart)
* `containers.wait` - [Docker API](https://docs.docker.com/engine/api/v1.40/#operation/ContainerWait)
* `containers.rm` - [Docker API](https://docs.docker.com/engine/api/v1.40/#operation/ContainerDelete)