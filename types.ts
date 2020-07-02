/*
*
* Networking
*
 */

interface EndpointIPAMConfig {
    IPv4Address?: string
    IPv6Address?: string
    LinkLocalIPs: string[]
}

interface EndpointSettings {
    IPAMConfig?: EndpointIPAMConfig | undefined
    Links?: string[]
    Aliases?: string[]
    NetworkID?: string
    EndpointID?: string
    Gateway?: string
    IPAddress?: string
    IPPrefixLen?: number
    IPv6Gateway?: string
    GlobalIPv6Address?: string
    MacAddress?: string
    DriverOpts?: object
}

interface Network {
    [key: string]: EndpointSettings
}

enum PortType {
    tcp= "tcp",
    udp= "udp",
    sctp= "stcp"
}

interface Port {
    IP?: string
    PrivatePort: number
    PublicPOrt?: number
    Type: PortType
}

interface HostConfig {
    NetworkMode?: string
}

interface NetworkSettings {
    Networks: Network
}

/*
*
* FileSystem
*
 */

interface BindOptions {
    Propagation: string
    NonRecursive: boolean
}

interface DriverConfig {
    Name?: string
    Options?: object
}

interface VolumeOptions {
    NoCopy?: boolean
    Labels?: object
    DriverConfig?: DriverConfig
}

interface TmpfsOptions {
    SizeBytes?: number
    Mode?: number
}

enum MountType {
    bind= "bind",
    volume= "volume",
    tmpfs= "tmpfs",
    npipe= "npipe"
}

enum MountConsistency {
    default= "default",
    consistent= "consistent",
    cached= "cached",
    delegated= "delegated"
}

interface Mount {
    Target?: string
    Source?: string
    Type?: MountType
    Readonly?: boolean
    Consistency?: MountConsistency
    BindOptions?: BindOptions
    VolumeOptions?: VolumeOptions
    TmpfsOptions: TmpfsOptions
}

/*
*
* High level elements
*
 */

interface ListContainer {
    Id?: string
    Names?: string[]
    Image?: string
    ImageID?: string
    Command?: string
    Created?: number
    Ports?: Port[]
    SizeRw?: number
    SizeRootFs?: number
    Labels?: object
    State?: string
    Status?: string
    HostConfig?: HostConfig
    NetworkSettings: NetworkSettings
    Mounts: Mount[]
}

export {
    ListContainer,
    Port
}