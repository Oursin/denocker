import {
  Mount,
  HostConfig,
  NetworkSettings,
  HealthStatus, HealthConfig
} from "./container.ts";

interface State {
  Status?: string;
  Running?: boolean;
  Paused?: boolean;
  Restarting?: boolean;
  OOMKilled?: boolean;
  Dead?: boolean;
  Pid?: number;
  ExitCode?: number;
  Error?: string;
  StartedAt?: string;
  FinishedAt?: string;
  Health?: HealthStatus;
}

interface ContainerConfig {
  HostName?: string;
  Domainname?: string;
  User?: string;
  AttachStdin?: boolean;
  AttachStdout?: boolean;
  AttachStderr?: boolean;
  ExposedPorts?: Record<string, Record<never, never>>;
  Tty?: boolean;
  OpenStdin?: boolean;
  StdinOnce?: boolean;
  Env?: Array<string>;
  Cmd?: Array<string>;
  HealthCheck?: HealthConfig;
  ArgsEscaped?: boolean | null;
  Image?: string;
  Volumes?: Record<string, Record<never, never>>;
  WorkingDir?: string;
  EntryPoint?: Array<string>
  NetworkDisabled?: boolean | null;
  MacAddress?: boolean | null;
  OnBuild?: Array<string> | null;
  Labels?: Record<string, string>;
  StopSignal?: string | null;
  StopTimeout?: number | null;
  Shell?: Array<string> | null;
}

export interface InspectResponse {
  Id?: string;
  Created?: Date;
  Path?: string;
  Args?: Array<string>;
  State?: State;
  Image?: string;
  ResolvConfPath?: string;
  HostnamePath?: string;
  HostsPath?: string;
  LogPath?: string;
  Node?: unknown;
  Name?: string;
  RestartCount?: number;
  Driver?: string;
  Platform?: string;
  MountLabel?: string;
  ProcessLabel?: string;
  AppArmorProfile?: string;
  ExecIDs?: Array<string> | null;
  HostConfig?: HostConfig;
  GraphDriver?: {Name: string; Data: Record<string, string>}
  SizeRw?: number;
  SizeRootFs?: number;
  Mounts?: Mount[];
  Config?: ContainerConfig;
  NetworkSettings?: NetworkSettings;
}
