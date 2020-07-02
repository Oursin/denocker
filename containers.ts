import client from './client.ts';
import { ListContainer } from './types.ts';

async function listContainers(): Promise<ListContainer[]> {
    const res = await client.get('/containers/json');
    return JSON.parse(res.body ?? "");
}

export {
    listContainers
}