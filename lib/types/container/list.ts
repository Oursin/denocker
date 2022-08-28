import { Port, HostConfig, Mount, NetworkSettings } from "./container.ts";

export interface ListContainerResponse {
  Id?: string;
  Names?: string[];
  Image?: string;
  ImageID?: string;
  Command?: string;
  Created?: number;
  Ports?: Port[];
  SizeRw?: number;
  SizeRootFs?: number;
  Labels?: Record<string, string>;
  State?: string;
  Status?: string;
  HostConfig?: HostConfig;
  NetworkSettings: NetworkSettings;
  Mounts: Mount[];
}
