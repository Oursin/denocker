import { HostConfig, HealthConfig, NetworkSettings } from './container.ts'

export interface ContainerCreate {
  // The hostname to use for the container, as a valid RFC 1123 hostname.
  Hostname?: string;
  // The domain name to use for the container
  Domainname?: string;
  // The user that commands are run as inside the container.
  User?: string;
  // Whether to attach to stdin.
  AttachStdin?: boolean;
  // Whether to attach to stdout.
  AttachStdout?: boolean;
  // Whether to attach to stderr.
  AttachStderr?: boolean;
  // An object mapping ports to an empty object in the form:
  //{"<port>/<tcp|udp|sctp>": {}}
  ExposedPorts?: Record<string, Record<never, never>>;
  // Attach standard streams to a TTY, including stdin if it is not closed.
  Tty?: boolean;
  // Open stdin
  OpenStdin?: boolean;
  // Close stdin after one attached client disconnects
  StdinOne?: boolean;
  // A list of environment variables to set inside the container in the form ["VAR=value", ...]. A variable without = is removed from the environment, rather than to have an empty value.
  Env?: string[];
  // Command to run specified as a string or an array of strings.
  Cmd?: string[];
  // A test to perform to check that the container is healthy.
  Healthcheck?: HealthConfig;
  // Command is already escaped (Windows only)
  ArgsEscaped?: boolean;
  // The name of the image to use when creating the container
  Image?: string;
  // An object mapping mount point paths inside the container to empty objects
  Volumes?: { [key: string]: Record<never, never> };
  // The working directory for commands to run in.
  WorkingDir?: string;
  // The entry point for the container as a string or an array of strings.
  // If the array consists of exactly one empty string ([""]) then the entry point is reset to system default (i.e., the entry point used by docker when there is no ENTRYPOINT instruction in the Dockerfile).
  Entrypoint?: string[];
  // Disable networking for the container.
  NetworkDisabled?: boolean;
  // MAC address of the container.
  MacAddress?: string;
  // ONBUILD metadata that were defined in the image's Dockerfile.
  OnBuild?: string[];
  // User-defined key/value metadata.
  Labels?: { [key: string]: string };
  // Signal to stop a container as a string or unsigned integer
  StopSignal?: string;
  // Timeout to stop a container in seconds.
  StopTimeout?: number;
  // Shell for when RUN, CMD, and ENTRYPOINT uses a shell.
  Shell?: string[];
  // Container configuration that depends on the host we are running on
  HostConfig?: HostConfig;
  // This container's networking configuration.
  NetworkingConfig?: NetworkSettings;
}

export interface ContainerCreateResponse {
  Id?: string;
  Warnings?: string[];
  message?: string;
}
