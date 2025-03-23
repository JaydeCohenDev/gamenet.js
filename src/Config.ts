import {ManagerOptions, SocketOptions} from "socket.io-client";

export interface IGameNetConfig {
    namespace?: string,
    opts?: Partial<ManagerOptions & SocketOptions>
}