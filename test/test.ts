import Docker from '../index.ts';

console.log(await Docker.containers.listContainers());