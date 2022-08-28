/*
*
* Networking
*
 */

interface EndpointIPAMConfig {
  IPv4Address?: string;
  IPv6Address?: string;
  LinkLocalIPs: string[];
}

interface EndpointSettings {
  IPAMConfig?: EndpointIPAMConfig | undefined;
  Links?: string[];
  Aliases?: string[];
  NetworkID?: string;
  EndpointID?: string;
  Gateway?: string;
  IPAddress?: string;
  IPPrefixLen?: number;
  IPv6Gateway?: string;
  GlobalIPv6Address?: string;
  MacAddress?: string;
  DriverOpts?: Record<string, unknown>;
}

interface Network {
  [key: string]: EndpointSettings;
}

enum PortType {
  tcp = "tcp",
  udp = "udp",
  sctp = "stcp",
}

interface Port {
  IP?: string;
  PrivatePort: number;
  PublicPOrt?: number;
  Type: PortType;
}

interface HostConfig {
  NetworkMode?: string;
}

interface NetworkSettings {
  Networks: Network;
}

/*
*
* FileSystem
*
 */

interface BindOptions {
  Propagation: string;
  NonRecursive: boolean;
}

interface DriverConfig {
  Name?: string;
  Options?: Record<string, unknown>;
}

interface VolumeOptions {
  NoCopy?: boolean;
  Labels?: Record<string, string>;
  DriverConfig?: DriverConfig;
}

interface TmpfsOptions {
  SizeBytes?: number;
  Mode?: number;
}

enum MountType {
  bind = "bind",
  volume = "volume",
  tmpfs = "tmpfs",
  npipe = "npipe",
}

enum MountConsistency {
  default = "default",
  consistent = "consistent",
  cached = "cached",
  delegated = "delegated",
}

interface Mount {
  Target?: string;
  Source?: string;
  Type?: MountType;
  Readonly?: boolean;
  Consistency?: MountConsistency;
  BindOptions?: BindOptions;
  VolumeOptions?: VolumeOptions;
  TmpfsOptions: TmpfsOptions;
}

interface HealthConfig {
  /*
    The test to perform. Possible values are:

    [] inherit healthcheck from image or parent image
    ["NONE"] disable healthcheck
    ["CMD", args...] exec arguments directly
    ["CMD-SHELL", command] run command with system's default shell
     */
  Test?: string[];
  Interval?: number;
  Timeout?: number;
  Retries?: number;
  StartPeriod?: number;
}

interface HealthStatus {
  Status?: string;
  FailingStreak?: number;
  Log: Array<unknown>
}

export type {
  Port,
  HostConfig,
  NetworkSettings,
  Mount,
  HealthConfig,
  HealthStatus
};
